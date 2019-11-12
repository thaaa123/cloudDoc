import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import FileSearch from './components/FileSearch/index';
import FileList from './components/FileList/index';
import DefalutFiles from './utils/defaultFiles';
import BottomBtn from './components/BottomBtn/index';
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons';
import TabList from './components/TabList/index';
import MdeEditer from './components/MdeEditer/index';
import uuidv4 from 'uuid';
import { flattenArr, objToArr } from './utils/helper';
import fileHelper from './utils/fileHelper';
import FileStore from './utils/store';
const { join, basename, extname, dirname } = window.require('path')
const { remote } = window.require('electron')

const fileStore = new FileStore('name', 'files Data')

function App() {
  const [ files, setFiles ] = useState(fileStore.getFiles())
  const [ activeFileId, setActiveFileId ] = useState('')
  const [ openedFileIDs, setOpenedFileIDs ] = useState([])
  const [ unsavedFileIds,  setUnsaveFileIds ] = useState([])
  const [ searchFiles, setSearchFiles ] = useState([])
  const filesArr = objToArr(files)
  const savedLocation = remote.app.getPath('documents')

  // fileStore.saveFilesToStore([])

  const openedFiles = openedFileIDs.map((fileId) => {
    return filesArr.find(file => file.id === fileId)
  })
  const activeFile = files[activeFileId]
  const fileListArr = searchFiles.length > 0 ? searchFiles : filesArr;

  const fileClick = (fileId) => {
    setActiveFileId(fileId)

    if (!files[fileId].isloaded) {
      fileHelper.readFile(join(savedLocation, `${files[fileId].title}.md`)).then((value) => {
        const newFile = { ...files[fileId], body: value, isloaded: true }
        setFiles({ ...files, [fileId]: newFile })
      })
    }

    if ( !openedFileIDs.includes(fileId) ) {
      setOpenedFileIDs([ ...openedFileIDs, fileId ])
    }
  }

  const tabClose = (id) => {
    const newFIles = openedFileIDs.filter(fileId => fileId !== id)
    setOpenedFileIDs(newFIles)

    if ( openedFileIDs.length > 0 ) {
      setActiveFileId(openedFileIDs[0])
    } else {
      setActiveFileId('')
    }
  }

  const fileChange = (fileId, val) => {
    const newFiles = { ...files[fileId], body: val }
    setFiles({ ...files, [fileId]: newFiles })

    if ( !unsavedFileIds.includes(fileId) ) {
      setUnsaveFileIds([ ...unsavedFileIds, fileId ])
    }
  }

  const tabClick = (fileId) => {
    setActiveFileId(fileId)
  }

  // 删除文件
  const delFile = (fileId) => {
    if (files[fileId].isNewFile) {
      const { [fileId]: value, ...afterDelete } = files
      setFiles(afterDelete)
    } else {
      fileHelper.delFile(files[fileId].path).then(() => {
        const { [fileId]: value, ...afterDelete } = files
        tabClose(fileId)
        setFiles(afterDelete)
        fileStore.saveFilesToStore(afterDelete)
      })
    }
  }

  const editFileName = (fileId, newName, isNewFile) => {
    const newPath = isNewFile ? join(savedLocation, `${newName}.md`) : join(dirname(files[fileId].path), `${newName}.md`)
    const modifiedFile = { ...files[fileId], title: newName, isNewFile: false, path: newPath}
    const newFiles = { ...files, [fileId]: modifiedFile }
    if (isNewFile) {
      fileHelper.writeFile(newPath, files[fileId].body).then(() => {
        fileStore.saveFilesToStore(newFiles)
        setFiles(newFiles)
      })
    } else {
      const oldPath = files[fileId].path
      fileHelper.renameFile(oldPath, newPath).then(() => {
        setFiles(newFiles)
        fileStore.saveFilesToStore(newFiles)
      })
    }
  }

  const fileSearch = (keyWord) => {
    const newFiles = filesArr.filter(file => file.title.indexOf(keyWord) > -1)
    setSearchFiles(newFiles)
  }

  const fileCreate = () => {
    const newId = uuidv4()

    const newFile = {
      id: newId,
      title: '',
      body: '### 请输出 markdown',
      createAt: new Date().getTime(),
      isNewFile: true
    }

    setFiles({ ...files, [newId]: newFile })
  }

  // 保存当前文件
  const saveCurrentFile = () => {
    fileHelper.writeFile(activeFile.path, activeFile.body).then(() => {
      setUnsaveFileIds(unsavedFileIds.filter(id => id !== activeFile.id))
    })
  }

  // 导入文件
  const importFiles = () => {
    remote.dialog.showOpenDialog({
      title: '请导入 Markdown 文件',
      properties: ['openFile', 'multiSelections'],
      filters: [{ name:'markdown files', extensions: ['md']}]
    }, (paths) => {
      if (Array.isArray(paths)) {
        // 过滤已存在文件
        const filteredPaths = paths.filter( path => {
          const exitedFile = Object.values(files).find(file => file.path === path)
          return !exitedFile
        })

        // 文件路径转换成文件对象数组
        const importFileArry = filteredPaths.map(path => {
          return {
            id: uuidv4(),
            title: basename(path, extname(path)),
            path,
          }
        })

        // 文件数组转换成flattenObj
        const newFiles = { ...files, ...flattenArr(importFileArry) }

        // 保存文件
        setFiles(newFiles)
        fileStore.saveFilesToStore(newFiles)
      }
    })
  }

  return (
    <div className="App container-fluid px-0">
      <div className="row no-gutters">
        <div className="col-3 leftPanel">
          <FileSearch onKeySearch={fileSearch}></FileSearch>
          <FileList files={ fileListArr }
            onFileClick={fileClick}
            onFileDel={delFile}
            onSaveEdit={editFileName}
          ></FileList>
          <div className="row no-gutters button-group">
            <div className="col">
              <BottomBtn 
                text="新建"
                colorClass="btn-primary"
                icon={faPlus}
                onBntClick={fileCreate}
              ></BottomBtn>
            </div>
            <div className="col">
              <BottomBtn 
                text="导入"
                colorClass="btn-success"
                icon={faFileImport}
                onBntClick={importFiles}
              ></BottomBtn>
            </div>

          </div>
        </div>
        <div className="col-9 rightPanel">
          {
            !openedFileIDs.length > 0 &&
            <div className="start-page">
              <span>选择或者创建新的 markdown 文档</span>
            </div>
          }
          {
            openedFileIDs.length !== 0 && 
            <>
              <TabList files={openedFiles} activeId={activeFileId} unsavedIds={unsavedFileIds} onTabClick={tabClick}
              onCloseTab={tabClose}
              ></TabList>
              <MdeEditer
                file={activeFile}
                fileChange={fileChange}
                saveCurrentFile={saveCurrentFile}
              ></MdeEditer>
            </>
          }

        </div>
      </div>
    </div>
  );
}

export default App;
