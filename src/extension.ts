// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode"
import * as path from "path"

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // 확장 프로그램이 활성화될 때 실행되는 코드
  console.log("필터링된 파일 탐색기가 활성화되었습니다.")

  class FileExplorerItem extends vscode.TreeItem {
    constructor(
      public readonly resourceUri: vscode.Uri,
      public readonly collapsibleState: vscode.TreeItemCollapsibleState,
      public readonly type: "file" | "folder",
      public readonly showFullPath: boolean = false,
      public readonly isPinned: boolean = false
    ) {
      super(resourceUri, collapsibleState)

      if (showFullPath && type === "folder") {
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(resourceUri)
        if (workspaceFolder) {
          const relativePath = path.relative(
            workspaceFolder.uri.fsPath,
            resourceUri.fsPath
          )
          this.label = `${relativePath}`
          this.description = workspaceFolder.name
        }
      } else {
        this.label = path.basename(resourceUri.fsPath)
      }

      // isPinned 상태에 따라 contextValue 설정
      this.contextValue = isPinned ? `${type}-pinned` : type

      // 핀 상태에 따라 아이콘 변경
      this.iconPath =
        type === "folder"
          ? new vscode.ThemeIcon(isPinned ? "pinned" : "folder")
          : new vscode.ThemeIcon("file")

      if (type === "file") {
        this.command = {
          command: "vscode.open",
          title: "Open File",
          arguments: [resourceUri],
        }
      }
    }
  }

  class FilteredExplorerProvider
    implements vscode.TreeDataProvider<FileExplorerItem>
  {
    private _onDidChangeTreeData: vscode.EventEmitter<
      FileExplorerItem | undefined | null | void
    > = new vscode.EventEmitter<FileExplorerItem | undefined | null | void>()
    readonly onDidChangeTreeData: vscode.Event<
      FileExplorerItem | undefined | null | void
    > = this._onDidChangeTreeData.event

    private searchText: string = ""
    private pinnedFolders: Set<string> = new Set()
    private pinnedFoldersOrder: string[] = []

    constructor() {
      // 파일 시스템 변경 감지
      const watcher = vscode.workspace.createFileSystemWatcher("**/*")
      watcher.onDidCreate(() => this.refresh())
      watcher.onDidDelete(() => this.refresh())
      watcher.onDidChange(() => this.refresh())
    }

    refresh(): void {
      this._onDidChangeTreeData.fire()
    }

    setSearchText(text: string) {
      console.log("검색어:", text)
      this.searchText = text.trim()
      this._onDidChangeTreeData.fire()
    }

    getTreeItem(element: FileExplorerItem): vscode.TreeItem {
      return element
    }

    private async getAllFolders(
      parentUri: vscode.Uri
    ): Promise<FileExplorerItem[]> {
      try {
        const entries = await vscode.workspace.fs.readDirectory(parentUri)
        let items: FileExplorerItem[] = []

        for (const [name, type] of entries) {
          // 숨김 파일/폴더 제외
          if (name.startsWith(".")) {
            continue
          }

          const uri = vscode.Uri.joinPath(parentUri, name)

          if (type === vscode.FileType.Directory) {
            if (
              !this.searchText ||
              name.toLowerCase().includes(this.searchText.toLowerCase())
            ) {
              items.push(
                new FileExplorerItem(
                  uri,
                  vscode.TreeItemCollapsibleState.Collapsed,
                  "folder",
                  true
                )
              )
            }
            const subFolders = await this.getAllFolders(uri)
            items = items.concat(subFolders)
          }
        }
        return items
      } catch (error) {
        console.error("getAllFolders 에러:", error)
        return []
      }
    }

    async getChildren(element?: FileExplorerItem): Promise<FileExplorerItem[]> {
      try {
        console.log("getChildren 호출됨, 검색어:", this.searchText)

        if (!element) {
          const workspaceFolders = vscode.workspace.workspaceFolders
          if (!workspaceFolders) {
            return []
          }

          let items: FileExplorerItem[] = []

          // 고정된 폴더들 먼저 표시
          for (const pinnedPath of this.pinnedFoldersOrder) {
            const uri = vscode.Uri.file(pinnedPath)
            items.push(
              new FileExplorerItem(
                uri,
                vscode.TreeItemCollapsibleState.Collapsed,
                "folder",
                true,
                true // isPinned
              )
            )
          }

          if (this.searchText) {
            // 검색 결과에서 이미 고정된 폴더는 제외
            let searchResults: FileExplorerItem[] = []
            for (const folder of workspaceFolders) {
              const folders = await this.getAllFolders(folder.uri)
              searchResults = searchResults.concat(
                folders.filter(
                  (f) => !this.pinnedFolders.has(f.resourceUri.fsPath)
                )
              )
            }
            items = items.concat(searchResults)
          }

          return items
        }

        // 하위 항목들 (검색어 유무와 관계없이 모두 표시)
        console.log("하위 항목 탐색:", element.resourceUri.fsPath)
        const entries = await vscode.workspace.fs.readDirectory(
          element.resourceUri
        )
        const items: FileExplorerItem[] = []

        for (const [name, type] of entries) {
          if (name.startsWith(".")) {
            continue
          }

          const uri = vscode.Uri.joinPath(element.resourceUri, name)

          if (type === vscode.FileType.Directory) {
            items.push(
              new FileExplorerItem(
                uri,
                vscode.TreeItemCollapsibleState.Collapsed,
                "folder"
              )
            )
          } else {
            items.push(
              new FileExplorerItem(
                uri,
                vscode.TreeItemCollapsibleState.None,
                "file"
              )
            )
          }
        }

        return items.sort((a, b) => {
          if (a.contextValue === b.contextValue) {
            return a.label!.toString().localeCompare(b.label!.toString())
          }
          return a.contextValue === "folder" ? -1 : 1
        })
      } catch (error) {
        console.error("getChildren 에러:", error)
        return []
      }
    }

    pinFolder(folder: FileExplorerItem) {
      const path = folder.resourceUri.fsPath
      this.pinnedFolders.add(path)
      if (!this.pinnedFoldersOrder.includes(path)) {
        this.pinnedFoldersOrder.push(path)
      }
      this.refresh()
    }

    unpinFolder(folder: FileExplorerItem) {
      const path = folder.resourceUri.fsPath
      this.pinnedFolders.delete(path)
      this.pinnedFoldersOrder = this.pinnedFoldersOrder.filter(
        (p) => p !== path
      )
      this.refresh()
    }

    reorderPinnedFolders(sourceIndex: number, targetIndex: number) {
      const item = this.pinnedFoldersOrder[sourceIndex]
      this.pinnedFoldersOrder.splice(sourceIndex, 1)
      this.pinnedFoldersOrder.splice(targetIndex, 0, item)
      this.refresh()
    }

    // getter 추가
    getPinnedFoldersOrder(): string[] {
      return this.pinnedFoldersOrder
    }

    moveItemUp(item: FileExplorerItem) {
      const path = item.resourceUri.fsPath
      const index = this.pinnedFoldersOrder.indexOf(path)
      if (index > 0) {
        this.reorderPinnedFolders(index, index - 1)
      }
    }

    moveItemDown(item: FileExplorerItem) {
      const path = item.resourceUri.fsPath
      const index = this.pinnedFoldersOrder.indexOf(path)
      if (index < this.pinnedFoldersOrder.length - 1) {
        this.reorderPinnedFolders(index, index + 1)
      }
    }

    pinFolderFromExplorer(uri: vscode.Uri) {
      const path = uri.fsPath
      this.pinnedFolders.add(path)
      if (!this.pinnedFoldersOrder.includes(path)) {
        this.pinnedFoldersOrder.push(path)
      }
      this.refresh()
    }
  }

  const explorerProvider = new FilteredExplorerProvider()

  // TreeView 등록
  const treeView = vscode.window.createTreeView("filteredExplorerView", {
    treeDataProvider: explorerProvider,
    canSelectMany: false, // 드래그 앤 드롭 관련 옵션 제거
  })

  // 검색 명령어 등록
  let searchCommand = vscode.commands.registerCommand(
    "filtered-explorer.searchFolders",
    async () => {
      const searchText = await vscode.window.showInputBox({
        placeHolder: "검색할 폴더 이름을 입력하세요",
        prompt:
          "필터링할 폴더 이름을 입력하세요. 빈 값을 입력하면 모든 폴더가 표시됩니다.",
      })

      if (searchText !== undefined) {
        explorerProvider.setSearchText(searchText)
      }
    }
  )

  let pinCommand = vscode.commands.registerCommand(
    "filtered-explorer.pinFolder",
    (folder: FileExplorerItem) => {
      explorerProvider.pinFolder(folder)
    }
  )

  let unpinCommand = vscode.commands.registerCommand(
    "filtered-explorer.unpinFolder",
    (folder: FileExplorerItem) => {
      explorerProvider.unpinFolder(folder)
    }
  )

  // 이동 명령어 등록
  let moveUpCommand = vscode.commands.registerCommand(
    "filtered-explorer.moveUp",
    (item: FileExplorerItem) => {
      explorerProvider.moveItemUp(item)
    }
  )

  let moveDownCommand = vscode.commands.registerCommand(
    "filtered-explorer.moveDown",
    (item: FileExplorerItem) => {
      explorerProvider.moveItemDown(item)
    }
  )

  let pinFromExplorerCommand = vscode.commands.registerCommand(
    "filtered-explorer.pinFolderFromExplorer",
    (uri: vscode.Uri) => {
      explorerProvider.pinFolderFromExplorer(uri)
    }
  )

  context.subscriptions.push(
    searchCommand,
    pinCommand,
    unpinCommand,
    moveUpCommand,
    moveDownCommand,
    pinFromExplorerCommand
  )
}

// This method is called when your extension is deactivated
export function deactivate() {
  // 확장 프로그램이 비활성화될 때 실행되는 코드
}
