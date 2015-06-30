@Grab(group='org.restlet.jse', module='org.restlet', version='2.3.2')
@Grab(group='commons-fileupload', module='commons-fileupload', version='1.3.1')
@Grab(group='org.restlet.osgi', module='org.restlet.ext.fileupload', version='2.2.2')


import java.io.BufferedReader
import java.io.InputStreamReader

import org.apache.commons.fileupload.FileItemIterator
import org.apache.commons.fileupload.FileItemStream
import org.apache.commons.fileupload.disk.DiskFileItemFactory

import org.restlet.*
import org.restlet.data.*
import org.restlet.data.MediaType
import org.restlet.data.Status
import org.restlet.ext.fileupload.RestletFileUpload
import org.restlet.representation.Representation
import org.restlet.representation.StringRepresentation
import org.restlet.representation.ByteArrayRepresentation
import org.restlet.resource.Post
import org.restlet.resource.ServerResource
import groovy.io.FileType

// RequestHandler will handle all of our requests
class RequestHandler extends Restlet {
    // handle() is called by the framework whenever there's a HTTP request
    def void handle(Request request, Response response) {
        println request.getResourceRef().getPath()
        def urlPath = request.getResourceRef().getPath()
        def muleDir = System.getenv("MULE_HOME")
        def deployDir = null
        def i
        String f
        boolean res = false


        if (request.method == Method.GET) {
            switch (urlPath) {
                case '/':
                case '/index.html':
                    def htmlFile = new File("index.html").getText('UTF-8')
                    response.setEntity(htmlFile, MediaType.TEXT_HTML)
                    break
                case '/favicon.ico':
                    def favIco = new File("favicon.ico").getBytes()
                    def img = new ByteArrayRepresentation(favIco , MediaType.IMAGE_ICON);
                    response.setEntity(img)
                    break
                case '/jquery-2.1.4.min.js':
                    def htmlFile = new File("jquery-2.1.4.min.js").getText('UTF-8')
                    response.setEntity(htmlFile, MediaType.APPLICATION_JAVASCRIPT)
                    break
                case '/mule-agent.js':
                    def htmlFile = new File("mule-agent.js").getText('UTF-8')
                    response.setEntity(htmlFile, MediaType.APPLICATION_JAVASCRIPT)
                    break
                case '/mule-agent.css':
                    def htmlFile = new File("mule-agent.css").getText('UTF-8')
                    response.setEntity(htmlFile, MediaType.TEXT_CSS)
                    break
                case '/getListApps':
                    response.setEntity(getListApps().join(", "), MediaType.TEXT_PLAIN)
                    break
                case '/getListDomains':
                    response.setEntity(getListDomains().join(", "), MediaType.TEXT_PLAIN)
                    break
                default:
                    response.setEntity("Unknown Command", MediaType.TEXT_PLAIN)
            }
        } else if (request.method == Method.DELETE) {

            if (urlPath.contains('/app/')) {
                i = urlPath.indexOf("/app/")
                f = urlPath.substring(i + 5)
                res = deleteApp(f)
                response.setEntity((res ? "SUCCESS" : "NO SUCCESS"), MediaType.TEXT_PLAIN)
            }
            else if (urlPath.contains('/domain/')) {
                i = urlPath.indexOf("/domain/")
                f = urlPath.substring(i + 8)
                res = deleteDomain(f)
                response.setEntity((res ? "SUCCESS" : "NO SUCCESS"), MediaType.TEXT_PLAIN)
            }
            else {
                response.setEntity("Unknown Command", MediaType.TEXT_PLAIN)
            }

        } else if (request.method == Method.POST) {

            switch (urlPath) {
                case '/app':
                    deployDir = muleDir + "/apps/"
                    break
                case '/domain':
                    deployDir = muleDir + "/domains/"
                    break
                default:
                    deployDir = muleDir + "/apps/"
            }

            println "DEPLOYING TO:" + deployDir
            //println request.getEntity().getMediaType()== MediaType.MULTIPART_FORM_DATA
            // 1/ Create a factory for disk-based file items
            DiskFileItemFactory factory = new DiskFileItemFactory()
            factory.setSizeThreshold(1000000000)

            // 2/ Create a new file  upload handler based on the Restlet
            // FileUpload extension that will parse Restlet requests and
            // generates FileItems.
            RestletFileUpload upload = new RestletFileUpload(factory)

            // 3/ Request is parsed by the handler which generates a
            // list of FileItems
            FileItemIterator fileIterator = upload.getItemIterator(request.getEntity())

            // Process only the uploaded item called "fileToUpload"
            // and return back
            boolean found = false;
            while (fileIterator.hasNext() && !found) {
                FileItemStream fi = fileIterator.next()
                println fi.getFieldName()
                if (fi.getFieldName().equals("fileUpload")) {
                    found = true;
                    // consume the stream immediately, otherwise the stream
                    // will be closed.
                    def ct = fi.getContentType()
                    def fn = fi.getName()
                    def fnDeploy = deployDir + fn
                    def sb = """
					{"media type" : "$ct" ,  "file name" : "$fn"}
					"""

                    FileOutputStream fos = new FileOutputStream(fnDeploy)
                    byte[] buffer = new byte[1024]
                    int noOfBytes = 0
                    BufferedInputStream is = new BufferedInputStream(fi.openStream())

                    while ((noOfBytes = is.read(buffer)) != -1) {
                        fos.write(buffer, 0, noOfBytes)
                    }
                    fos.close()

                    i = fn.indexOf(".zip")
                    def dN = new File(deployDir + fn.substring(0, i) + "-anchor.txt")
                    println dN
                    while (!dN.exists()) {
                        sleep(5000)
                        println """Waiting until $fnDeploy is DEPLOYED"""
                    }

                    /* def result = new StringRepresentation(sb, MediaType.APPLICATION_JSON)
                    println result
                    response.setEntity(result) */

                    response.setStatus(Status.SUCCESS_CREATED)
                    def htmlFile = new File("deploy_response.html").getText('UTF-8')
                    response.setEntity(htmlFile, MediaType.TEXT_HTML)

                }
            }
        } else {
            response.setStatus(Status.CLIENT_ERROR_METHOD_NOT_ALLOWED)
            response.setAllowedMethods([Method.GET] as Set)
        }
    }

    def getListApps() {
        def muleAppsDir = System.getenv("MULE_HOME") + "/apps"
        println "GETTING APPS " + muleAppsDir
        def list = []
        def anchors = []

        def dir = new File(muleAppsDir)
        dir.eachFileRecurse(FileType.FILES) { file ->
            list << file
        }
        list.each {
            if (it.getName().contains("-anchor")) {
                if (!it.getName().contains("default-anchor")) {
                    anchors << it.getName()
                }
            }
        }

        return anchors
    }

    def getListDomains() {
        def muleDomainsDir = System.getenv("MULE_HOME") + "/domains"
        println "GETTING DOMAINS " + muleDomainsDir
        def list = []
        def anchors = []

        def dir = new File(muleDomainsDir)
        dir.eachFileRecurse(FileType.FILES) { file ->
            list << file
        }
        list.each {
            if (it.getName().contains("-anchor")) {
                if (!it.getName().contains("default-anchor")) {
                    anchors << it.getName()
                }
            }
        }

        return anchors
    }


    def deleteApp(String fN) {
        def muleAppsDir = System.getenv("MULE_HOME") + "/apps/"
        println "DELETING: " + muleAppsDir + fN
        def fD = new File(muleAppsDir + fN)
        boolean appSuccessfullyDeleted = fD.delete()

        def dirN = fN.replace("-anchor.txt", "")
        println "Waiting for: " + dirN
        def dN = new File(muleAppsDir + dirN)

        while (dN.exists()) {
            sleep(5000)
            println "Waiting until the App is removed"
        }

        return appSuccessfullyDeleted
    }

    def deleteDomain(String fN) {
        def muleDomainsDir = System.getenv("MULE_HOME") + "/domains/"
        println "DELETING: " + muleDomainsDir + fN
        def fD = new File(muleDomainsDir + fN)
        boolean domainSuccessfullyDeleted = fD.delete()

        def dirN = fN.replace("-anchor.txt", "")
        println "Waiting for: " + dirN
        def dN = new File(muleDomainsDir + dirN)

        while (dN.exists()) {
            sleep(5000)
            println "Waiting until the Domain is removed"
        }

        return domainSuccessfullyDeleted
    }
}

new Server(Protocol.HTTP, 3000, new RequestHandler()).start()


