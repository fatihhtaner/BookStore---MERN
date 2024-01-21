import {
  Admin,
  Resource,
  EditGuesser,
  ShowGuesser,
} from "react-admin";
import { dataProvider } from "./dataProvider";
import { authProvider } from "./authProvider/authProvider";
import { BookList } from "./components/Books/books";
import { UserList } from "./components/Users/users";
import { UserCreate } from "./components/Users/userCreate";
import { OrderList } from "./components/Orders/orders";
import { CreateBook } from "./components/Books/createBook";
import LoginPage from "./LoginPage/loginPage";
import { ReportList } from "./components/Reports/reports";
import { ReportCreate } from "./components/Reports/reportCreate";


export const App = () => (
  <Admin dataProvider={dataProvider} authProvider={authProvider} loginPage={LoginPage}>
    <Resource
      name="books"
      list={BookList}
      edit={EditGuesser}
      show={ShowGuesser}
      create={CreateBook}
    />
    <Resource 
      name="users" 
      list={UserList} 
      edit={EditGuesser}
      show={ShowGuesser}
      create={UserCreate}
    />
    <Resource 
      name="orders" 
      list={OrderList} 
      edit={EditGuesser}
      show={ShowGuesser}
    />
    <Resource 
      name="reports"
      list={ReportList}
      edit={EditGuesser}
      show={ShowGuesser}
      create={ReportCreate}
    />
  </Admin>
);
