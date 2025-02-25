# VS Code 확장 프로그램에 오신 것을 환영합니다

## 폴더 내용물 설명

- 이 폴더에는 확장 프로그램에 필요한 모든 파일이 포함되어 있습니다.
- `package.json` - 확장 프로그램을 선언하고 명령어를 정의하는 매니페스트 파일입니다.
  - 샘플 플러그인은 명령어를 등록하고 해당 명령어의 제목과 이름을 정의합니다. VS Code는 이 정보를 통해 명령 팔레트에 명령어를 표시할 수 있습니다. 이 시점에서는 아직 플러그인을 로드할 필요가 없습니다.
- `src/extension.ts` - 명령어 구현을 제공하는 메인 파일입니다.
  - 이 파일은 `activate` 함수를 내보내며, 이 함수는 확장 프로그램이 처음 활성화될 때 호출됩니다(이 경우 명령어를 실행할 때). `activate` 함수 내에서 `registerCommand`를 호출합니다.
  - 명령어 구현이 포함된 함수를 `registerCommand`의 두 번째 매개변수로 전달합니다.

## 바로 시작하기

- `F5`를 눌러 확장 프로그램이 로드된 새 창을 엽니다.
- 명령 팔레트에서 (`Ctrl+Shift+P` 또는 Mac의 경우 `Cmd+Shift+P`)를 누르고 `Hello World`를 입력하여 명령어를 실행합니다.
- `src/extension.ts` 내부에 중단점을 설정하여 확장 프로그램을 디버깅합니다.
- 디버그 콘솔에서 확장 프로그램의 출력을 확인할 수 있습니다.

## 변경사항 적용하기

- `src/extension.ts`의 코드를 변경한 후 디버그 도구 모음에서 확장 프로그램을 다시 실행할 수 있습니다.
- VS Code 창을 다시 로드(`Ctrl+R` 또는 Mac의 경우 `Cmd+R`)하여 변경 사항을 적용할 수도 있습니다.

## API 탐색하기

- `node_modules/@types/vscode/index.d.ts` 파일을 열면 전체 API 세트를 확인할 수 있습니다.

## 테스트 실행하기

- [Extension Test Runner](https://marketplace.visualstudio.com/items?itemName=ms-vscode.extension-test-runner)를 설치합니다.
- **Tasks: Run Task** 명령을 통해 "watch" 작업을 실행하세요. 이 작업이 실행 중이어야 테스트가 발견됩니다.
- 활동 표시줄에서 테스트 뷰를 열고 "Run Test" 버튼을 클릭하거나, `Ctrl/Cmd + ; A` 단축키를 사용하세요.
- 테스트 결과 뷰에서 테스트 결과 출력을 확인하세요.
- `src/test/extension.test.ts`를 수정하거나 `test` 폴더 내에 새 테스트 파일을 만드세요.
  - 제공된 테스트 러너는 `**.test.ts` 이름 패턴과 일치하는 파일만 고려합니다.
  - `test` 폴더 내에 폴더를 만들어 원하는 방식으로 테스트를 구성할 수 있습니다.

## 더 나아가기

- VS Code의 기본 인터페이스 및 패턴과 원활하게 통합되는 확장 프로그램을 만들기 위해 [UX 가이드라인을 따르세요](https://code.visualstudio.com/api/ux-guidelines/overview).
- [확장 프로그램 번들링](https://code.visualstudio.com/api/working-with-extensions/bundling-extension)을 통해 확장 프로그램 크기를 줄이고 시작 시간을 개선하세요.
- VS Code 확장 프로그램 마켓플레이스에 [확장 프로그램을 게시](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)하세요.
- [지속적 통합](https://code.visualstudio.com/api/working-with-extensions/continuous-integration)을 설정하여 빌드를 자동화하세요.
- 사용자가 보고한 이슈와 기능 요청을 받기 위해 [이슈 보고](https://code.visualstudio.com/api/get-started/wrapping-up#issue-reporting) 흐름에 통합하세요.
