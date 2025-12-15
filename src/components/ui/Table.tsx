import React from 'react';

interface TableProps {
    children: React.ReactNode;
    className?: string;
}

export const Table: React.FC<TableProps> = ({ children, className = '' }) => {
    return (
        <div className="overflow-x-auto">
            <table className={`table ${className}`}>{children}</table>
        </div>
    );
};

interface TableHeaderProps {
    children: React.ReactNode;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ children }) => {
    return <thead>{children}</thead>;
};

interface TableBodyProps {
    children: React.ReactNode;
}

export const TableBody: React.FC<TableBodyProps> = ({ children }) => {
    return <tbody>{children}</tbody>;
};

interface TableRowProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

export const TableRow: React.FC<TableRowProps> = ({ children, onClick, className = '' }) => {
    return (
        <tr onClick={onClick} className={`${onClick ? 'cursor-pointer' : ''} ${className}`}>
            {children}
        </tr>
    );
};

interface TableHeadProps {
    children: React.ReactNode;
    className?: string;
}

export const TableHead: React.FC<TableHeadProps> = ({ children, className = '' }) => {
    return <th className={className}>{children}</th>;
};

interface TableCellProps {
    children: React.ReactNode;
    className?: string;
}

export const TableCell: React.FC<TableCellProps> = ({ children, className = '' }) => {
    return <td className={className}>{children}</td>;
};
