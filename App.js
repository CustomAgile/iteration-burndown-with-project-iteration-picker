Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function() {
        var widgetPanel = Ext.create('Ext.Panel', {
            itemId: 'widget',
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            items:[
                {
                    xtype: 'rallyprojectpicker',
                    itemId:'projectPicker',
                    fieldLabel: 'Select Project',
                    workspace:  this.getContext().getWorkspace()._ref,
                    value: this.getContext().getProject()._ref,
                        listeners:{
                            change: this.onProjectSelected,
                            scope: this
                        },
                    width: 300,
                    mqrgin: 20
                },
                {
                    xtype: 'rallyiterationcombobox',
                    itemId: 'iterationPicker',
                    fieldLabel: 'Select Iteration:',
                    listeners: {
                        ready: this.onIterationSelected,
                        select:this.onIterationSelected,
                        scope: this
                    },
                    width: 300,
                    margin: 20
                }
            ]
        });
        this.add(widgetPanel);
        this.add({
            xtype: 'container',
            itemId: 'reportContainer'
        });
    },
    onProjectSelected:function(combobox){
        console.log('project', combobox.getSelectedRecord().get('_ref'));
        if (Ext.ComponentQuery.query('rallystandardreport[itemId=report]')[0]) {
            Ext.ComponentQuery.query('#reportContainer')[0].remove(Ext.ComponentQuery.query('rallystandardreport[itemId=report]')[0], true);
        }
        Ext.ComponentQuery.query('#iterationPicker')[0].setProject(combobox.getSelectedRecord().get('_ref'));
    },
    onIterationSelected:function(combobox){
        console.log('iteration', combobox.getValue());
        if (Ext.ComponentQuery.query('rallystandardreport[itemId=report]')[0]) {
            console.log('report exists');
            Ext.ComponentQuery.query('#reportContainer')[0].remove(Ext.ComponentQuery.query('rallystandardreport[itemId=report]')[0], true);
        }
        this.down('#reportContainer').add({
            xtype: 'rallystandardreport',
            itemId: 'report',
            width: 800,
            height: 600,
            reportConfig: {
                report: Rally.ui.report.StandardReport.Reports.IterationBurndown,
                iterations: combobox.getValue()
            }
        });
    }
});
