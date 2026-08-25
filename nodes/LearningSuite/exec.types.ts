import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';

/** Unified function type for all execute handlers. */
export type ExecuteHandler = (ctx: IExecuteFunctions, itemIndex: number) => Promise<IDataObject | IDataObject[]>;

/** Registry type: resource -> operation -> handler */
export type HandlersRegistry = Record<string, Record<string, ExecuteHandler>>;
