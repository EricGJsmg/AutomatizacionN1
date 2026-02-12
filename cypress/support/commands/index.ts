/** TYPES */
/// <reference path="./globals/globals-command.d.ts" />
/// <reference path="./db/db-command.d.ts" />

/// <reference path="./rf/cdo/rf-command.d.ts" />
/// <reference path="./rf/llica/rf-command.d.ts" />

/// <reference path="./dxc/cdo/dxc-command.d.ts" />
/// <reference path="./dxc/llica/dxc-command.d.ts" />

/** GENERAL COMMANDS */
import './globals/globals-command';
import './db/db-command';

import './rf/cdo/rf-command';
import './rf/llica/rf-command';

import './dxc/cdo/dxc-command';
import './dxc/llica/dxc-command';

/** TESTS COMMANDS */
import '../../e2e/cdo/inbound/inbound-command';
