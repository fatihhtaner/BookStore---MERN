import { Create, SimpleForm, DateInput, SelectInput} from 'react-admin';

export const ReportCreate = () => {
   
    return (
        <Create>
            <SimpleForm >
                <SelectInput source='orderStatusToFilter' 
                choices={[
                    { id: 'all', name: 'All' },
                    { id: 'Pending', name: 'Pending' },
                    { id: 'Processing', name: 'Processing' },
                    { id: 'Canceled', name: 'Canceled' },
                    { id: 'Shipped', name: 'Shipped' },
                    { id: 'Completed', name: 'Completed' },
                ]} />
                <DateInput source="beginDate" />
                <DateInput source="endDate" />
            </SimpleForm>
        </Create>
    )
};