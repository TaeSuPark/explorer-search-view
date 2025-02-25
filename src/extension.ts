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
      public readonly type: "file" | "folder"
    ) {
      super(resourceUri, collapsibleState)
      this.label = path.basename(resourceUri.fsPath)
      this.contextValue = type
      this.iconPath =
        type === "folder"
          ? new vscode.ThemeIcon("folder")
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
                  "folder"
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
          // 루트 레벨일 때
          const workspaceFolders = vscode.workspace.workspaceFolders
          if (!workspaceFolders) {
            return []
          }

          if (this.searchText) {
            // 검색어가 있을 때는 모든 매칭되는 폴더를 보여줌
            let allFolders: FileExplorerItem[] = []
            for (const folder of workspaceFolders) {
              const folders = await this.getAllFolders(folder.uri)
              allFolders = allFolders.concat(folders)
            }
            return allFolders
          }

          // 검색어가 없을 때는 워크스페이스 폴더들만 보여줌
          return workspaceFolders.map(
            (folder) =>
              new FileExplorerItem(
                folder.uri,
                vscode.TreeItemCollapsibleState.Expanded,
                "folder"
              )
          )
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
  }

  const explorerProvider = new FilteredExplorerProvider()

  // TreeView 등록
  const treeView = vscode.window.createTreeView("filteredExplorerView", {
    treeDataProvider: explorerProvider,
    canSelectMany: true,
    dragAndDropController: {
      // 드래그 앤 드롭 지원
      dropMimeTypes: ["text/uri-list"],
      dragMimeTypes: ["text/uri-list"],
    },
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

  context.subscriptions.push(searchCommand)
}

// This method is called when your extension is deactivated
export function deactivate() {
  // 확장 프로그램이 비활성화될 때 실행되는 코드
}
