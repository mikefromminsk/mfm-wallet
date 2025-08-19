# Code style

Write clearly and specifically, without ambiguity.
ALWAYS return the full source code of modified files (maintain structure).
Maintain a consistent coding style throughout the project (indentation, quotes, formatting).
Variable and function names should be short and informative (e.g., userList, configPath, errorMsg).
Do not delete or modify code without explicit instructions.
ALWAYS remove semicolons in js files.
NEVER add new comments, but do not delete existing comments.
Group code for readability:
- CSS — by class blocks.
- JS — functions at the top, execution code below.
Do not invent or describe anything that does not exist in the project unless specified in the request.
ALWAYS use only double quotes for strings in js files.
In js objects written over multiple lines, a comma must always be at the end.

# Navigation and Structure

For a single window, always create one controller.js and index.html.
In the navigation.js file, specify simplified access to open windows.
Embed usage instructions inside the windows in a new folder faq with language names en.html and ru.html and so on, with text only using <p> tags.
The windows with all actions of this window should be located inside the folder of the window from which it opens.
Translations should be located in the strings folder inside the window folder.

**Connect the controller in the main index.html**
```html
<script async onload="loaded()" src="/mfm-wallet/withdrawal/controller.js?v=15"></script>
```

**Add window opening to navigator.js**
```javascript
function addNavigator($scope) {
	// all openings that already exist

	$scope.openNewWindow = function (success) {
		openNewWindow(success)
	}
}
```
