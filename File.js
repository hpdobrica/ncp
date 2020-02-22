const fs = require('fs').promises;

// in minutes
const FILE_EXPIRATION_TIME = process.env.FILE_EXPIRATION_TIME ? +process.env.FILE_EXPIRATION_TIME : 3

class File {
    constructor(id) {
        this.id = id;
        this.path = `./content/${id}`;
    }

    async write(data) {
        return await fs.appendFile(this.path, data);
    }

    startExpiration() {
        setTimeout(() => {
            fs.unlink(this.path)
        }, FILE_EXPIRATION_TIME * 60 * 1000);
    }
}

module.exports = File;