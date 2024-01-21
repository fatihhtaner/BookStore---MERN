import { Create, SimpleForm, TextInput, NumberInput, useRefresh, fetchUtils } from 'react-admin';

export const CreateBook = () => {
   
    return (
        <Create>
            <SimpleForm >
                <TextInput source='title' />
                <TextInput source='author' />
                <NumberInput source='pageNumber' />
                <NumberInput source='cost' />
                <TextInput source='ISBN' />
            </SimpleForm>
        </Create>
    )
};