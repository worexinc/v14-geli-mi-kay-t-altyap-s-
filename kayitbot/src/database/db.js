const fs = require('fs');
const path = require('path');

const dbFolder = path.join(__dirname, 'data');
if (!fs.existsSync(dbFolder)) {
    fs.mkdirSync(dbFolder);
}

class JsonDB {
    constructor(filename) {
        this.path = path.join(dbFolder, `${filename}.json`);
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, JSON.stringify({}, null, 2));
        }
    }

    get(key) {
        const data = JSON.parse(fs.readFileSync(this.path, 'utf8'));
        if (!key) return data;
        return data[key];
    }

    set(key, value) {
        const data = JSON.parse(fs.readFileSync(this.path, 'utf8'));
        data[key] = value;
        fs.writeFileSync(this.path, JSON.stringify(data, null, 2));
        return data[key];
    }

    delete(key) {
        const data = JSON.parse(fs.readFileSync(this.path, 'utf8'));
        delete data[key];
        fs.writeFileSync(this.path, JSON.stringify(data, null, 2));
    }

    push(key, element) {
        const data = JSON.parse(fs.readFileSync(this.path, 'utf8'));
        if (!data[key]) data[key] = [];
        if (!Array.isArray(data[key])) throw new Error(`Key ${key} is not an array`);
        data[key].push(element);
        fs.writeFileSync(this.path, JSON.stringify(data, null, 2));
    }

    includes(key, element) {
        const data = JSON.parse(fs.readFileSync(this.path, 'utf8'));
        if (!data[key] || !Array.isArray(data[key])) return false;
        return data[key].includes(element);
    }

    update(key, updates) {
        const data = JSON.parse(fs.readFileSync(this.path, 'utf8'));
        if (!data[key]) data[key] = {};
        data[key] = { ...data[key], ...updates };
        fs.writeFileSync(this.path, JSON.stringify(data, null, 2));
    }
}

module.exports = {
    guilds: new JsonDB('guilds'),
    users: new JsonDB('users'),
    bannedTags: new JsonDB('bannedTags')
};
