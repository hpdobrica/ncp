const nanoid = require('nanoid');
const net = require('net');

const File = require('./File');

const URL = 'p.dobrica.sh'

class Connection {
    /**
     * @param  {net.Socket} socket
     */
    constructor(socket) {
        this.id = nanoid().replace(/[^a-z0-9+]+/gi, '');
        this.socket = socket;
        console.log(this.socket);
        this.lastPacketReceivedAt = new Date().getTime();
        this.initLivenessChecker();
        this.file = new File(this.id);
    }

    initLivenessChecker() {
        this.livenessIntervalId = setInterval(() => {
            if(this.lastPacketReceivedAt+1000 > new Date().getTime()) {
                return;
            }

            const url = `${URL}/${this.id}`;
            console.log(url);
            this.socket.write(url, (err) => {
                if(err) {
                    console.log(err);
                }
                this.closeConnection();
            });
                
        }, 1000);
    }

    closeConnection(message = '') {
        clearInterval(this.livenessIntervalId);
        this.livenessIntervalId = null;
        console.log('called socket end')
        this.socket.write(`${message}\n`, () => {
            this.file.startExpiration();
            this.socket.destroy();
        })
    }


    /**
     * @param  {Buffer} buffer
     */
    handleIncomingData(buffer){
        this.lastPacketReceivedAt = new Date().getTime()
    
        const sizeInMb = getBytesReadInMb(this.socket.bytesRead);
        console.log('size:', sizeInMb);
    
        if(sizeInMb > 5) {
            this.closeConnection('over the size limit');
            return;
        }
    
    
    
        const data = buffer.toString('utf8');
        // console.log(data);
        console.log('write data here...');
        this.file.write(data);
    }

    
}

const getBytesReadInMb = (bytesRead) => {
    const BYTES_IN_MB = 1000000;
    return bytesRead / BYTES_IN_MB
}


module.exports = Connection;