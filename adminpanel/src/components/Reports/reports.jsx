import { List, Datagrid, TextField, FunctionField } from "react-admin";

// eslint-disable-next-line react/prop-types
const DownloadButtonField = ({ record }) => (
    // eslint-disable-next-line react/prop-types
    <a href={record.downloadLink} download>
      <button>Download</button>
    </a>
  );

export const ReportList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="type" />
            <TextField source="status" />
            <FunctionField
                label="Download"
                render={(record) => <DownloadButtonField record={record} />}
      />
        </Datagrid>
    </List>
)