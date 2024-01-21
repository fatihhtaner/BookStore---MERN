import { List, Datagrid, TextField, EditButton, DeleteButton, CreateButton } from "react-admin";

export const BookList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="pageNumber" />
            <TextField source="price" />
            <TextField source="ISBN" />
            <EditButton  />
            <DeleteButton />
        </Datagrid>
    </List>
)