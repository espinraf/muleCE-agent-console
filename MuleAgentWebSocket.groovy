@Grab(group='org.java-websocket', module='Java-WebSocket', version='1.3.0')

import org.java_websocket.WebSocket
import org.java_websocket.WebSocketImpl
import org.java_websocket.handshake.ClientHandshake
import org.java_websocket.server.WebSocketServer

import java.io.IOException
import java.net.InetSocketAddress
import java.util.Collection


/**
 * Created by espinraf on 18/05/15.
 */
class MuleAgentWebSocket extends WebSocketServer {


    MuleAgentWebSocket(int port) {
        super( new InetSocketAddress( port ) );
    }

    MuleAgentWebSocket(InetSocketAddress address) {
        super( address );
    }

    @Override
    public void onOpen( WebSocket conn, ClientHandshake handshake ) {
        println 'Open'
    }

    @Override
    public void onClose( WebSocket conn, int code, String reason, boolean remote ) {
        println 'Close'
    }

    @Override
    public void onMessage( WebSocket conn, String message ) {
        //this.sendToAll( message );

        println conn + ": " + message
    }


    @Override
    public void onError( WebSocket conn, Exception ex ) {

        println 'Error'
    }

    public void startDebug() throws InterruptedException , IOException {
        WebSocketImpl.DEBUG = true;
        this.start();
        println 'Server started on port: 9090'

    }

    /**
     * Sends <var>text</var> to all currently connected WebSocket clients.
     *
     * @param text
     *            The String to send across the network.
     * @throws InterruptedException
     *             When socket related I/O errors occur.
     */
    public void sendToAll( String text ) {
        Collection<WebSocket> con = connections();
        synchronized ( con ) {
            for( WebSocket c : con ) {
                c.send( text );
            }
        }
    }

    public void updateWebPage(WebSocket con, String text ) {
        con.send( text );
    }

}
