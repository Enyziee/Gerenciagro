import DataSourceProd from './DataSourceProd';
import DataSourceLocal from './DataSourceLocal';

export default process.env.NODE_ENV === 'production' ? DataSourceProd : DataSourceLocal;
