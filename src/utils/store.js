import { objToArr } from './helper';
const Store = window.require('electron-store')

class FileStore {
    constructor(name, conent) {
        this.fileStore = new Store(name, conent)
    }
    saveFilesToStore(files) {
        const filesStoreObj = objToArr(files).reduce((result, file) => {
            let { id, title, path, createdAt } = file
            result[id] = {
                id,
                title,
                path,
                createdAt,
            }
            return result
        }, {})
        this.fileStore.set('files', filesStoreObj)
    }
    getFiles() {
        return this.fileStore.get('files') || {}
    }
    clearFiles() {
        return this.fileStore.set([])
    }
}

export default FileStore
