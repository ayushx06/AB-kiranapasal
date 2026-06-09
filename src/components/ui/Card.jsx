import { classNames } from '../../utils/helpers';

export const Card = ({ children, className }) => (
  <div className={classNames('rounded-lg border border-slate-100 bg-white p-4 shadow-sm', className)}>{children}</div>
);
