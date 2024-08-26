import { IgxColumnComponent, DataType, IgxNumberFilteringOperand, IgxStringFilteringOperand } from 'igniteui-angular';


 ///  Filter logic starts
 export function getFilterValue(column: IgxColumnComponent): any {
    return this._filterValues.has(column) ? this._filterValues.get(column) : null;
  }

  export function onInput(input: any, column: IgxColumnComponent) { 
    this._filterValues.set(column, input.value);

    if (input.value === "") {
      this.grid1.clearFilter(column.field);
      return;
    }

    let operand = null;
    switch (column.dataType) {
      case DataType.Number:
        operand = IgxNumberFilteringOperand.instance().condition("equals");
        break;
      default:
        operand = IgxStringFilteringOperand.instance().condition("contains");
    }
    this.grid1.filter(column.field, this.transformValue(input.value, column), operand, column.filteringIgnoreCase);
  }

  export function clearInput(column: IgxColumnComponent) {
    this._filterValues.delete(column);
    this.grid1.clearFilter(column.field);
  }

  export function transformValue(value: any, column: IgxColumnComponent): any {
    if (column.dataType === DataType.Number) {
      value = parseFloat(value);
    }
    return value;
  }
///  Filter logic ends