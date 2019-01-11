// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

function completeCommandRegex(commandName:string)
{
	var re = new RegExp( "\\\\"+commandName+"\\{([\\w\\d,./:\\s]*)\\}" , "g");		
	return re;
}

function parameterlessCommandRegex(commandName:string)
{
	var re = new RegExp( "\\\\" +commandName , "g");		
	return re;
}

function completeOptionalParameterRegex()
{	
	var regex = /\[[\w\d.\\=]*\]/g;
	return regex ;		
}

function cleanup(toModify:string) {	
	let result = toModify.replace(completeOptionalParameterRegex(),"");

	let keepContentList = [ "ac" ,"paragraph", "section" , "subsection", "gls" , "acp", "caption"];
	for (let entry of keepContentList) {
		let regEx = completeCommandRegex(entry);
		result = result.replace(regEx,"$1");
	}	
	

	let dropList = [ "cite" ,"autoref" , "label" , "chapter" ,"centering" , "begin", "end" , "includegraphics" , "ref"];
	for (let entry of dropList) {
		let regEx = completeCommandRegex(entry);
		result = result.replace(regEx,"");
	}

	let removeCommandList = [ "centering" ];
	for (let entry of removeCommandList) {
		let regEx = parameterlessCommandRegex(entry);
		result = result.replace(regEx,"");
	}
	
	// todo: drop all unkwn command


	
	var emptyBraces = /\([\s]*\)/g;
	return result.replace(emptyBraces,"");
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "delatex" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.DeLatex', () => {
		// The code you place here will be executed every time your command is executed
		
		
		let editor = vscode.window.activeTextEditor;
		if (editor)
		{

			let doc = editor.document;
			if (doc)
			{
				let fullText = doc.getText()								
				const fullRange = new vscode.Range(
    					doc.positionAt(0),
						doc.positionAt(fullText.length ));
						
				let modif = cleanup(fullText);
				editor.edit( (builder) => {			
							 	builder.replace(fullRange,modif);
							});				
			}
		}
		// Display a message box to the user

		vscode.window.showInformationMessage('Remove Latex Command Finished');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
