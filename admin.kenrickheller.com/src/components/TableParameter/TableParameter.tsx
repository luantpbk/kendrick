import './TableParameter.css';
import React, { useState } from 'react';
import { DataTypeList, EnumDataType, HtmlColumnsType, HtmlTableParameterType } from 'src/api/models';
import Input from '../Input';
import SelectBoxComponent from '../SelectBoxComponent/SelectBoxComponent';

interface ITableParameter {
  tableParameters: HtmlTableParameterType[];
  onChange: (value: HtmlTableParameterType[]) => void;
}

const TableParameter: React.FC<ITableParameter> = (props) => {
  const {tableParameters, onChange} = props;

  return (
    <div className="table-param-container">
      <div className="table-param">
        <div className="table-param-component title">TableName</div>
        <div className="table-param-component title">TableCss</div>
        <div className="table-param-component title">RowCss</div>
        <div className="table-param-detail">
          <div className="table-param-detail-component">
            <div className="table-param-component title">ColumnTitle</div>
            <div className="table-param-component title">ColumnName</div>
            <div className="table-param-component title">DataType</div>
            <div className="table-param-component title">ColumnCss</div>
            <div className="email-template-btn-component title"></div>
          </div>
        </div>
      </div>
      {tableParameters?.map((row: HtmlTableParameterType, index: number) => {
        return (
          <div key={`table-param-${index}`} className={`table-param ${index % 2 == 0 ? 'chan' : 'le'}`}>
            <div className="table-param-component">
              <Input
                require={false}
                disabled={false}
                value={row.tableName}
                onChange={(value) => {
                  row.tableName = value;
                  onChange([...tableParameters]);
                }}
              />
            </div>
            <div className="table-param-component">
              <Input
                require={false}
                disabled={false}
                value={row.tableCss}
                onChange={(value) => {
                  row.tableCss = value;
                  onChange([...tableParameters]);
                }}
              />
            </div>
            <div className="table-param-component">
              <Input
                require={false}
                disabled={false}
                value={row.rowCss}
                onChange={(value) => {
                  row.rowCss = value;
                  onChange([...tableParameters]);
                }}
              />
            </div>
            <div className="table-param-detail">
              {row.columns.map((column: HtmlColumnsType, cIndex: number) => {
                return (
                  <div key={`column-param-${index}-${cIndex}`} className="table-param-detail-component">
                    <div className="table-param-component">
                      <Input
                        require={false}
                        disabled={false}
                        value={column.columnTitle}
                        onChange={(value) => {
                          column.columnTitle = value;
                          onChange([...tableParameters]);
                        }}
                      />
                    </div>
                    <div className="table-param-component">
                      <Input
                        require={false}
                        disabled={false}
                        value={column.columnName}
                        onChange={(value) => {
                          column.columnName = value;
                          onChange([...tableParameters]);
                        }}
                      />
                    </div>
                    <div className="table-param-component">
                      <SelectBoxComponent
                        require={false}
                        onChange={(value) => {
                          column.dataType = value;
                          onChange([...tableParameters]);
                        }}
                        isDisable={false}
                        value={column.dataType}
                        data={DataTypeList}
                        valueType={'value'}
                        titleType={'title'}
                      />
                    </div>
                    <div className="table-param-component">
                      <Input
                        require={false}
                        disabled={false}
                        value={column.columnCss}
                        onChange={(value) => {
                          column.columnCss = value;
                          onChange([...tableParameters]);
                        }}
                      />
                    </div>
                    <div
                      className="email-template-btn-component title"
                      onClick={() => {
                        row.columns = row.columns.filter(c => c != column);
                        onChange([...tableParameters]);
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </div>
                  </div>
                );
              })}
              <div className="table-param-detail-component">
                <div
                  className="email-template-add-btn"
                  onClick={() => {
                    row.columns = [...row.columns, {cellCss: undefined, columnCss: undefined, columnName: undefined, columnTitle: undefined, dataType: EnumDataType.Text}];
                    onChange([...tableParameters]);
                  }}
                >
                  Add column
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="table-param">
        <div className="email-template-add-btn" onClick={() => {
          onChange([...tableParameters, {columns: [], rowCss: undefined, tableCss: undefined, tableName: undefined}]);
        }}>
          Add table param
        </div>
      </div>
    </div>
  );
};

export default TableParameter;
