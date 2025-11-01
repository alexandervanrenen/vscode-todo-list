import * as vscode from 'vscode';
import { Uri } from 'vscode';

const FILE_NAME = "todo.todo";

async function openOrCreateFile(context: vscode.ExtensionContext) {
	// Get folder uri, might be undefined if no workspace is open
	const folderUri = context.storageUri;
	if (!folderUri) {
		vscode.window.showWarningMessage("Can not open todo list without an open workspace");
		return;
	}

	// Create folder
	await vscode.workspace.fs.createDirectory(folderUri);
	const fileUri = Uri.joinPath(folderUri, FILE_NAME);

	// Make sure file exists
	try {
		console.log("project-todo-list: trying to open file ..");
		return await vscode.workspace.openTextDocument(fileUri);
	} catch (e) {
		console.log("project-todo-list: trying to create file ..");
		try {
			await vscode.workspace.fs.writeFile(fileUri, new Uint8Array([]));
		} catch (e) {
			vscode.window.showErrorMessage("Could not access todo file.");
		}
		return await vscode.workspace.openTextDocument(fileUri);
	}
}

async function openTodo(context: vscode.ExtensionContext) {
	const file = await openOrCreateFile(context);
	if (file) {
		const doc = await vscode.window.showTextDocument(file, { preview: true });
		return doc;
	}
}

export function activate(context: vscode.ExtensionContext) {
	console.log('project-todo-list: activated !!!');

	let disposable = vscode.commands.registerCommand('project-todo-list.show-todo-list', () => {
		console.log('project-todo-list: run open command');
		openTodo(context).then(ok => {
			console.log("project-todo-list: all good");
		}).then(undefined, error => {
			console.log("project-todo-list: " + error);
		});
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
