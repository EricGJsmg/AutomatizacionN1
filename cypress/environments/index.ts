/**
 * Different environments are used but only so that the reports are accessible in different environments, the tests are always in INT
 */
import { environment as cdo_dev } from './cdo/environment.cdo.dev';
import { environment as cdo_int } from './cdo/environment.cdo.int';
import { environment as cdo_pro } from './cdo/environment.cdo.pro';
// import { environment as llica_dev } from './llica/environment.llica.dev';
// import { environment as llica_int } from './llica/environment.llica.int';
// import { environment as llica_pro } from './llica/environment.llica.pro';

import dotenv from 'dotenv';
dotenv.config();

const environments = {
  ...{ cdo_dev, cdo_int, cdo_pro },
  // ...{ llica_dev, llica_int, llica_pro },
};
const env = process.env.ENV as keyof typeof environments;

if (!environments[env]) throw new Error(`Variable de entorno 'ENV' no está definida.`);
if (!process.env.USER) throw new Error(`Variable de entorno 'USER' no está definida.`);
if (!process.env.PSSW) throw new Error(`Variable de entorno 'PSSW' no está definida.`);

// jenkins debug
console.warn({ ...environments[env], user: process.env.USER, env });

export const environment = {
  ...environments[env],
  username: process.env.USER,
  password: process.env.PSSW,
};
