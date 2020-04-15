class Config {
    constructor() {
        this.data = {
            InsertNode: {
                color: 'rgb(255,255,243)'
            },
            Placeholder: {
                color: 'rgb(255,255,243)'
            },
            InsertCase: {
                color: 'rgb(250, 218, 209)'
            },
            InputNode: {
                use: true,
                id: 'InputButton',
                text: 'Eingabe-Feld',
                icon: 'taskIcon',
                color: 'rgb(253, 237, 206)'
            },
            OutputNode: {
                use: true,
                id: 'OutputButton',
                text: 'Ausgabe-Feld',
                icon: 'taskIcon',
                color: 'rgb(253, 237, 206)'
            },
            TaskNode: {
                use: true,
                id: 'TaskButton',
                text: 'Anweisung',
                icon: 'taskIcon',
                color: 'rgb(253, 237, 206)'
            },
            CountLoopNode: {
                use: true,
                id: 'CountLoopButton',
                text: 'Zählergesteuerte Schleife',
                icon: 'countLoopIcon',
                color: 'rgb(220, 239, 231)'
            },
            HeadLoopNode: {
                use: true,
                id: 'HeadLoopButton',
                text: 'Kopfgesteuerte Schleife',
                icon: 'countLoopIcon',
                color: 'rgb(220, 239, 231)'
            },
            FootLoopNode: {
                use: true,
                id: 'FootLoopButton',
                text: 'Fußgesteuerte Schleife',
                icon: 'footLoopIcon',
                color: 'rgb(220, 239, 231)'
            },
            BranchNode: {
                use: true,
                id: 'BranchButton',
                text: 'Verzweigung',
                icon: 'branchIcon',
                color: 'rgb(250, 218, 209)'
            },
            CaseNode: {
                use: true,
                id: 'CaseButton',
                text: 'Fallunterscheidung',
                icon: 'caseIcon',
                color: 'rgb(250, 218, 209)'
            }
        }


        this.alternatives = {
            'python': {
                InsertNode: {
                    color: 'rgb(255,255,243)'
                },
                Placeholder: {
                    color: 'rgb(255,255,243)'
                },
                InsertCase: {
                    color: 'rgb(250, 218, 209)'
                },
                InputNode: {
                    use: true,
                    id: 'InputButton',
                    text: 'Eingabe-Feld',
                    icon: 'taskIcon',
                    color: 'rgb(253, 237, 206)'
                },
                OutputNode: {
                    use: true,
                    id: 'OutputButton',
                    text: 'Ausgabe-Feld',
                    icon: 'taskIcon',
                    color: 'rgb(253, 237, 206)'
                },
                TaskNode: {
                    use: true,
                    id: 'TaskButton',
                    text: 'Anweisung',
                    icon: 'taskIcon',
                    color: 'rgb(253, 237, 206)'
                },
                CountLoopNode: {
                    use: false,
                    id: 'CountLoopButton',
                    text: 'Zählergesteuerte Schleife',
                    icon: 'countLoopIcon',
                    color: 'rgb(220, 239, 231)'
                },
                HeadLoopNode: {
                    use: true,
                    id: 'HeadLoopButton',
                    text: 'Schleife',
                    icon: 'countLoopIcon',
                    color: 'rgb(220, 239, 231)'
                },
                FootLoopNode: {
                    use: false,
                    id: 'FootLoopButton',
                    text: 'Fußgesteuerte Schleife',
                    icon: 'footLoopIcon',
                    color: 'rgb(220, 239, 231)'
                },
                BranchNode: {
                    use: true,
                    id: 'BranchButton',
                    text: 'Verzweigung',
                    icon: 'branchIcon',
                    color: 'rgb(250, 218, 209)'
                },
                CaseNode: {
                    use: true,
                    id: 'CaseButton',
                    text: 'Fallunterscheidung',
                    icon: 'caseIcon',
                    color: 'rgb(250, 218, 209)'
                }
            },
            2: {
                InsertNode: {
                    color: 'rgb(255,255,243)'
                },
                Placeholder: {
                    color: 'rgb(255,255,243)'
                },
                InsertCase: {
                    color: 'rgb(250, 218, 209)'
                },
                InputNode: {
                    use: false,
                    id: 'InputButton',
                    text: 'Eingabe-Feld',
                    icon: 'taskIcon',
                    color: 'rgb(253, 237, 206)'
                },
                OutputNode: {
                    use: false,
                    id: 'OutputButton',
                    text: 'Ausgabe-Feld',
                    icon: 'taskIcon',
                    color: 'rgb(253, 237, 206)'
                },
                TaskNode: {
                    use: true,
                    id: 'TaskButton',
                    text: 'Anweisung',
                    icon: 'taskIcon',
                    color: 'rgb(253, 237, 206)'
                },
                CountLoopNode: {
                    use: true,
                    id: 'CountLoopButton',
                    text: 'Zählergesteuerte Schleife',
                    icon: 'countLoopIcon',
                    color: 'rgb(220, 239, 231)'
                },
                HeadLoopNode: {
                    use: true,
                    id: 'HeadLoopButton',
                    text: 'Kopfgesteuerte Schleife',
                    icon: 'countLoopIcon',
                    color: 'rgb(220, 239, 231)'
                },
                FootLoopNode: {
                    use: false,
                    id: 'FootLoopButton',
                    text: 'Fußgesteuerte Schleife',
                    icon: 'footLoopIcon',
                    color: 'rgb(220, 239, 231)'
                },
                BranchNode: {
                    use: true,
                    id: 'BranchButton',
                    text: 'Verzweigung',
                    icon: 'branchIcon',
                    color: 'rgb(250, 218, 209)'
                },
                CaseNode: {
                    use: true,
                    id: 'CaseButton',
                    text: 'Fallunterscheidung',
                    icon: 'caseIcon',
                    color: 'rgb(250, 218, 209)'
                }
            }
        }
    }

    get() {
        return this.data;
    }

    loadConfig(id) {
        if (id in this.alternatives) {
            this.data = this.alternatives[id];
        }
    }
}

export const config =  new Config();
