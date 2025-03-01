import React, { useMemo } from 'react';
import TableContainer from "../Components/Common/TableContainerReactTable";

const DataTable = (props) => {  
    const data      = props.Data 
    const columns   = useMemo(() => props.Columns);
  
    return (
      <React.Fragment >
        <TableContainer
          columns={(columns || [])}
          data={(data || [])}
          isPagination={true}
          isGlobalFilter={true}
          iscustomPageSize={false}
          isBordered={false}
          customPageSize={!!props?.pageSize && props?.pageSize}
          className="custom-header-css table align-middle table-nowrap"
          tableClassName="table-centered align-middle table-nowrap mb-0"
          theadClassName="text-muted table-light table-nowrap"
          SearchPlaceholder='Search...'
        />
      </React.Fragment>
    );
  };

  export default DataTable