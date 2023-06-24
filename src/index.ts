import * as express from "express"
import * as bodyParser from "body-parser"
import * as cors from "cors"
import helmet from "helmet"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import routes from "./routes"


const PORT = process.env.port || 3000;

AppDataSource.initialize().then(async () => {

    // create express app
    const app = express()
    app.use(cors());
    app.use(helmet());
    app.use(express.json());

    app.use('/', routes);

    app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto ${PORT}`);
      });

    
   
 
}).catch(error => console.log(error))
