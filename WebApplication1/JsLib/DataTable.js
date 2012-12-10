  
  var DataTable=function(c, r) {
	this.__type ="DataTable"
	this.Columns = [];
	this.Rows = [];
	this.addColumn = function(name, type) {
		this.Columns.push({Name:name,__type:type});
	};
	this.toJSON = function() {
		var dt = {};
		var i;
		dt.Columns = [];
		for(i=0; i<this.Columns.length; i++)
			dt.Columns.push([this.Columns[i].Name, this.Columns[i].__type]);
		dt.Rows = [];
		for(i=0; i<this.Rows.length; i++) {
			var row = [];
			for(var j=0; j<this.Columns.length; j++)
				row.push(this.Rows[i][this.Columns[j].Name]);
			dt.Rows.push(row);
		}
		return AjaxPro.toJSON(dt);
	};
	this.addRow = function(row) {
		this.Rows.push(row);
	};
	if(c != null) {
		for(var i=0; i<c.length; i++)
			this.addColumn(c[i][0], c[i][1]);
	}
	if(r != null) {
		for(var y=0; y<r.length; y++) {
			var row = {};
			for(var z=0; z<this.Columns.length && z<r[y].length; z++)
				row[this.Columns[z].Name] = r[y][z];
			this.addRow(row);
		}
	}
};