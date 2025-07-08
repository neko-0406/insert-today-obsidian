import { App, Editor, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { format } from 'date-fns';

interface InsertTodaySettings {
	format: string;
}

const DEFAULT_SETTINGS: InsertTodaySettings = {
	format: 'yyyy-MM-dd HH:mm:ss'
}

export default class InsertToday extends Plugin {
	settings: InsertTodaySettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'insert-today',
			name: 'Insert today\'s date',
			hotkeys: [
				{
					modifiers: ['Mod', 'Shift'],
					key: ';'
				}
			],
			editorCallback: (editor: Editor) => {
				const now = new Date();
				editor.replaceSelection(format(now, this.settings.format));
			}
		});

		this.addSettingTab(new InsertTodaySettingTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class InsertTodaySettingTab extends PluginSettingTab {
	plugin: InsertToday;

	constructor(app: App, plugin: InsertToday) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Date format')
			.setDesc('The format for the inserted date.')
			.addText(text => text
				.setPlaceholder('Enter your format')
				.setValue(this.plugin.settings.format)
				.onChange(async (value) => {
					this.plugin.settings.format = value;
					await this.plugin.saveSettings();
				}));
	}
}