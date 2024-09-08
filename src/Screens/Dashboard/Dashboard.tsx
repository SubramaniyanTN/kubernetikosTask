import {
  ActionIcon,
  Button,
  Center,
  Flex,
  Group,
  MantineTheme,
  Text,
  TextInput,
  rem,
} from "@mantine/core";
import { closeAllModals, openModal } from "@mantine/modals";
import {
  IconClick,
  IconEdit,
  IconMessage,
  IconTrash,
  IconTrashX,
} from "@tabler/icons-react";
import {
  DataTable,
  DataTableColumn,
  DataTableProps,
  DataTableSortStatus,
} from "mantine-datatable";
import { useContextMenu } from "mantine-contextmenu";
import { useCallback, useEffect, useState } from "react";
import classes from "./ComplexUsageExample.module.css";
import { useGetContacts } from "../../Query/Contacts/contacts";
import SUPABASE_TABLE, { ContactsType } from "../../utils/SUPABASE_TABLE";
import { supabase } from "../../utils";

let PAGE_SIZE = 10;

const Dashboard = () => {
  const [limit, setLimit] = useState(10);
  const { showContextMenu, hideContextMenu } = useContextMenu();
  const [page, setPage] = useState(1);
  const [sortStatus, setSortStatus] = useState<
    DataTableSortStatus<ContactsType>
  >({
    columnAccessor: "name",
    direction: "asc",
  });

  const contacts = useGetContacts("", limit);
  console.log(contacts.error);
  const tableData = contacts.data?.pages.map((singlePage) => singlePage).flat();

  const [selectedRecords, setSelectedRecords] = useState<ContactsType[]>([]);

  const handleSortStatusChange = (
    status: DataTableSortStatus<ContactsType>
  ) => {
    setPage(1);
    setSortStatus(status);
  };

  const initialData = async () => {
    const response = await supabase.from(SUPABASE_TABLE.contacts).select("*");
    console.log({ response });
  };
  useEffect(() => {
    initialData();
  }, []);

  const editRecord = useCallback(({ name }: ContactsType) => {
    console.log({
      withBorder: true,
      title: "Editing record",
      message: `In a real application we could show a popup to edit ${name}, but this is just a demo, so we're not going to do that`,
    });
  }, []);

  const deleteRecord = useCallback(({ name }: ContactsType) => {
    console.log({
      withBorder: true,
      color: "red",
      title: "Deleting record",
      message: `Should delete ${name}, but we're not going to, because this is just a demo`,
    });
  }, []);

  const deleteSelectedRecords = useCallback(() => {
    console.log({
      withBorder: true,
      color: "red",
      title: "Deleting multiple records",
      message: `Should delete ${selectedRecords.length} records, but we're not going to do that because deleting data is bad... and this is just a demo anyway`,
    });
  }, [selectedRecords.length]);

  const sendMessage = useCallback(({ name }: ContactsType) => {
    console.log({
      withBorder: true,
      title: "Sending message",
      message: `A real application could send a message to ${name}, but this is just a demo and we're not going to do that because we don't have a backend`,
      color: "green",
    });
  }, []);

  const renderActions: DataTableColumn<ContactsType>["render"] = (record) => (
    <Group gap={4} justify="right" wrap="nowrap">
      <ActionIcon
        size="sm"
        variant="transparent"
        color="green"
        onClick={(e) => {
          e.stopPropagation(); // 👈 prevent triggering the row click function
          openModal({
            title: `Send message to ${record.name}`,
            classNames: {
              header: classes.modalHeader,
              title: classes.modalTitle,
            },
            children: (
              <>
                <TextInput mt="md" placeholder="Your message..." />
                <Group mt="md" gap="sm" justify="flex-end">
                  <Button
                    variant="transparent"
                    c="dimmed"
                    onClick={() => closeAllModals()}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="green"
                    onClick={() => {
                      sendMessage(record);
                      closeAllModals();
                    }}
                  >
                    Send
                  </Button>
                </Group>
              </>
            ),
          });
        }}
      >
        <IconMessage size={16} />
      </ActionIcon>
      <ActionIcon
        size="sm"
        variant="transparent"
        onClick={(e) => {
          e.stopPropagation(); // 👈 prevent triggering the row click function
          editRecord(record);
        }}
      >
        <IconEdit size={16} />
      </ActionIcon>
    </Group>
  );

  const rowExpansion: DataTableProps<ContactsType>["rowExpansion"] = {
    allowMultiple: true,
    content: ({
      record: {
        id,
        age,
        city,
        company,
        department,
        description,
        email,
        name,
        state,
        created_at,
      },
    }) => (
      <Flex p="xs" pl={rem(50)} gap="md" align="center">
        <Text size="sm" fs="italic">
          {description}
        </Text>
      </Flex>
    ),
  };

  const handleContextMenu: DataTableProps<ContactsType>["onRowContextMenu"] = ({
    record,
    event,
  }) =>
    showContextMenu([
      {
        key: "edit",
        icon: <IconEdit size={14} />,
        title: `Edit ${record.name} `,
        onClick: () => editRecord(record),
      },
      {
        key: "delete",
        title: `Delete ${record.name} `,
        icon: <IconTrashX size={14} />,
        color: "red",
        onClick: () => deleteRecord(record),
      },
      { key: "divider" },
      {
        key: "deleteMany",
        hidden:
          selectedRecords.length <= 1 ||
          !selectedRecords.map((r) => r.id).includes(record.id),
        title: `Delete ${selectedRecords.length} selected records`,
        icon: <IconTrash size={14} />,
        color: "red",
        onClick: deleteSelectedRecords,
      },
    ])(event);

  const aboveXs = (theme: MantineTheme) =>
    `(min-width: ${theme.breakpoints.xs})`;

  const columns: DataTableProps<ContactsType>["columns"] = [
    {
      accessor: "name",
      noWrap: true,
      sortable: true,
      // render: ({ firstName, lastName }) => `${firstName} ${lastName}`,
    },
    {
      accessor: "email",
      sortable: true,
    },
    {
      accessor: "company",
      title: "Company",
      noWrap: true,
      sortable: true,
      visibleMediaQuery: aboveXs,
    },
    {
      accessor: "department",
      title: "Department",
      sortable: true,
      visibleMediaQuery: aboveXs,
    },
    {
      accessor: "city",
      title: "City",
      noWrap: true,
      visibleMediaQuery: aboveXs,
    },
    {
      accessor: "state",
      title: "State",
      visibleMediaQuery: aboveXs,
    },
    {
      accessor: "age",
      width: 80,
      textAlign: "right",
      sortable: true,
      visibleMediaQuery: aboveXs,
    },
    {
      accessor: "actions",
      title: (
        <Center>
          <IconClick size={16} />
        </Center>
      ),
      width: "0%", // 👈 use minimal width
      render: renderActions,
    },
  ];

  return (
    <div className={classes.tableContainer}>
      <DataTable
        height="calc(100vh - 80px)" // Adjust this height based on the remaining space after other elements
        minHeight={400}
        maxHeight={1000}
        withTableBorder
        highlightOnHover
        borderRadius="sm"
        withColumnBorders
        striped
        verticalAlign="top"
        pinLastColumn
        columns={columns}
        fetching={contacts.isFetching}
        records={tableData || []}
        page={page}
        onPageChange={setPage}
        totalRecords={tableData?.length || 0}
        recordsPerPage={PAGE_SIZE}
        sortStatus={sortStatus}
        onSortStatusChange={handleSortStatusChange}
        selectedRecords={selectedRecords}
        onSelectedRecordsChange={setSelectedRecords}
        rowExpansion={rowExpansion}
        onRowContextMenu={handleContextMenu}
        onScroll={hideContextMenu}
      />
    </div>
  );
};

export default Dashboard;
