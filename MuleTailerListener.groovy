/**
 * Created by espinraf on 27/08/15.
 */
@Grab(group='commons-io', module='commons-io', version='2.4')

import org.apache.commons.io.input.TailerListenerAdapter



class MuleTailerListener extends TailerListenerAdapter {

    public MuleAgentWebSocket mws

    public void handle(String line) {
        mws.sendToAll(line)
    }
}


