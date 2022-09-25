const QUERY_IGNORE = '-password -is_deleted -is_enabled -role';

const QUERY_LOCKED_IGNORE = {
   is_deleted: false,
   is_enabled: true,
};

const QUERY_DELETED_IGNORE = {
   is_deleted: false,
};

const QUERY_DELETED = {
   is_deleted: true,
};

const QUERY_ENABLED = {
   is_enabled: true,
};

const QUERY_DISABLED = {
   is_enabled: false,
};

const PAGE_SIZE = 20;

export {
   QUERY_DELETED_IGNORE,
   PAGE_SIZE,
   QUERY_DELETED,
   QUERY_DISABLED,
   QUERY_IGNORE,
   QUERY_LOCKED_IGNORE,
   QUERY_ENABLED,
};
