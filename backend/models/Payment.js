let payments = [];

class Payment {
    constructor(data) {
        Object.assign(this, data);
        this._id = Math.random().toString(36).substring(7);
        this.date = this.date || new Date();
        this.whatsappSent = this.whatsappSent || false;
    }

    async save() {
        // Find existing to update if it exists
        const index = payments.findIndex(p => p._id === this._id);
        if (index > -1) {
            payments[index] = this;
        } else {
            payments.push(this);
        }
        return this;
    }

    static _createFindResult(results) {
        return {
            sort: function() { return results; },
            then: function(resolve) { resolve(results); }
        };
    }

    static find(filter) {
        let results = payments;
        if (filter && Object.keys(filter).length > 0) {
            results = payments.filter(p => {
                let match = true;
                for (let key in filter) {
                    if (p[key] !== filter[key]) match = false;
                }
                return match;
            });
        }
        // sort by date descending
        results = results.sort((a, b) => new Date(b.date) - new Date(a.date));
        return this._createFindResult(results);
    }

    static async findByIdAndUpdate(id, data, options) {
        const index = payments.findIndex(p => p._id === id);
        if (index > -1) {
            payments[index] = { ...payments[index], ...data };
            return payments[index];
        }
        return null;
    }

    static async findByIdAndDelete(id) {
        const index = payments.findIndex(p => p._id === id);
        if (index > -1) {
            payments.splice(index, 1);
        }
        return { msg: 'Deleted' };
    }
}

module.exports = Payment;