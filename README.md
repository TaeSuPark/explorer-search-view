# VS Code Extension: Folder Selector

## Features

Folder Selector is a VS Code extension that allows you to easily navigate and manage project folders. It provides the following key features:

- **Folder Search**: Quickly filter and find folders by name.
- **Folder Pinning**: Pin frequently used folders for easy access.
- **Pinned Folder Management**: Change the order of pinned folders or unpin them.
- **File System Integration**: Pin folders directly from the default explorer.

## How to Use

### Searching Folders

1. Click the "Folder Selector" icon in the activity bar.
2. Click the search icon at the top of the view or run the "Filter Folders" command from the command palette.
3. Enter the folder name to search, and all matching folders will be displayed.

### Pinning Folders

1. Find a folder in the search results or folder tree.
2. Click the pin icon next to the folder to pin it.
3. Pinned folders are always displayed at the top of the list.

### Managing Pinned Folders

- **Change Order**: Use the up/down arrows next to pinned folders to change their order.
- **Unpin**: Click the unpin icon next to a pinned folder to unpin it.
- **Reset**: Click the reset button at the top of the view to remove all pinned folders and search filters.

### Pinning Directly from Explorer

1. Right-click on a folder in VS Code's default file explorer.
2. Select "Pin to Folder Selector" from the context menu.

## Requirements

- Visual Studio Code 1.80.0 or higher

## Extension Settings

No special setting options are provided in the current version. They will be added in future updates.

## Known Issues

- Slight delay may occur when searching folders in large projects.
- In the current version, `node_modules` folders and hidden files/folders (items starting with `.`) are not displayed.

## Release Notes

### 0.0.1

- Initial release
- Folder search and filtering functionality
- Folder pinning and management features
- File system change detection

## Feedback and Contributions

Please submit bug reports or feature requests through the issue tracker in the GitHub repository.

## License

Distributed under the MIT License.

# VS Code 확장 프로그램: 폴더 선택기

## 기능 소개

폴더 선택기는 VS Code에서 프로젝트 폴더를 쉽게 탐색하고 관리할 수 있는 확장 프로그램입니다. 다음과 같은 주요 기능을 제공합니다:

- **폴더 검색**: 이름으로 폴더를 빠르게 필터링하여 찾을 수 있습니다.
- **폴더 고정**: 자주 사용하는 폴더를 고정하여 쉽게 접근할 수 있습니다.
- **고정 폴더 관리**: 고정된 폴더의 순서를 변경하거나 고정을 해제할 수 있습니다.
- **파일 시스템 통합**: 기본 탐색기에서 폴더를 직접 고정할 수 있습니다.

## 사용 방법

### 폴더 검색

1. 활동 표시줄에서 "폴더 선택기" 아이콘을 클릭합니다.
2. 뷰 상단의 검색 아이콘을 클릭하거나 명령 팔레트에서 "폴더 필터링" 명령을 실행합니다.
3. 검색할 폴더 이름을 입력하면 일치하는 모든 폴더가 표시됩니다.

### 폴더 고정하기

1. 검색 결과나 폴더 트리에서 폴더를 찾습니다.
2. 폴더 옆의 핀 아이콘을 클릭하여 고정합니다.
3. 고정된 폴더는 항상 목록 상단에 표시됩니다.

### 고정된 폴더 관리

- **순서 변경**: 고정된 폴더 옆의 위/아래 화살표를 사용하여 순서를 변경할 수 있습니다.
- **고정 해제**: 고정된 폴더 옆의 핀 해제 아이콘을 클릭하여 고정을 해제할 수 있습니다.
- **초기화**: 뷰 상단의 초기화 버튼을 클릭하여 모든 고정된 폴더와 검색 필터를 제거할 수 있습니다.

### 탐색기에서 직접 고정하기

1. VS Code의 기본 파일 탐색기에서 폴더를 마우스 오른쪽 버튼으로 클릭합니다.
2. 컨텍스트 메뉴에서 "폴더 선택기에 고정하기"를 선택합니다.

## 설치 요구 사항

- Visual Studio Code 1.80.0 이상

## 확장 프로그램 설정

현재 버전에서는 특별한 설정 옵션이 제공되지 않습니다. 향후 업데이트에서 추가될 예정입니다.

## 알려진 문제점

- 대용량 프로젝트에서 폴더 검색 시 약간의 지연이 발생할 수 있습니다.
- 현재 버전에서는 `node_modules` 폴더와 숨김 파일/폴더(`.`로 시작하는 항목)는 표시되지 않습니다.

## 릴리스 노트

### 0.0.1

- 초기 릴리스
- 폴더 검색 및 필터링 기능
- 폴더 고정 및 관리 기능
- 파일 시스템 변경 감지 기능

## 피드백 및 기여

버그 신고나 기능 요청은 GitHub 저장소의 이슈 트래커를 통해 제출해 주세요.

## 라이선스

MIT 라이선스에 따라 배포됩니다.
