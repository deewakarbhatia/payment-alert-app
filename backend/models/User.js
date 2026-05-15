const bcrypt = require('bcryptjs');

const users = [];

class User {
    constructor(data) {
        Object.assign(this, data);
        this._id = Math.random().toString(36).substring(7);
        this.passwordModified = true;
    }

    async save() {
        if (this.passwordModified) {
            this.password = await bcrypt.hash(this.password, 10);
            this.passwordModified = false;
        }
        users.push(this);
        return this;
    }

    static async findOne(query) {
        return users.find(u => {
            let match = true;
            for (let key in query) {
                if (u[key] !== query[key]) match = false;
            }
            return match;
        });
    }
}

module.exports = User;