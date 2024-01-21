import { List, Datagrid, TextField, EditButton, DeleteButton, EmailField, CreateButton } from "react-admin";

export const UserList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="username" />
            <EmailField source="email" />
            <EditButton  />
            <DeleteButton />
        </Datagrid>
    </List>
)