import { List, Datagrid, TextField, EditButton, DeleteButton } from "react-admin";

export const OrderList = () => (
    <List>
        <Datagrid>
            <TextField source="orderBooks" />
            <TextField source="status" />
            <TextField source="totalPrice" />
            <TextField source="createdAt" />
            <EditButton />
            <DeleteButton  />
        </Datagrid>
    </List>
)