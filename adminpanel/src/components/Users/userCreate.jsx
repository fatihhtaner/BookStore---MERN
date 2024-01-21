import { Create, SimpleForm, TextInput, SelectInput } from 'react-admin';

export const UserCreate = () => {

    return (
        <Create>
            <SimpleForm>
                <TextInput source='username' />
                <TextInput source='email' />
                <TextInput source='password' />
                <SelectInput 
                    source="role"
                    choices={[
                        { id: 'admin', name: 'admin' },
                        { id: 'user', name: 'user' },
                    ]}
                />
            </SimpleForm>
        </Create>
    )
}
