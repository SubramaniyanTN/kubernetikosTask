import {
  ActionIcon,
  Button,
  Center,
  Flex,
  Group,
  Image,
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
import { useQuery } from "@tanstack/react-query";
import {
  DataTable,
  DataTableColumn,
  DataTableProps,
  DataTableSortStatus,
} from "mantine-datatable";
import dayjs from "dayjs";
import { useContextMenu } from "mantine-contextmenu";
import { useCallback, useEffect, useState } from "react";
import classes from "./ComplexUsageExample.module.css";
import supabase from "../../utils/supabaseConfig";
import { SUPABASE_TABLE } from "../../utils";
import { useGetContacts } from "../../Query/Contacts/contacts";

type Employee = any;
let PAGE_SIZE = 10;

const Dashboard = () => {
  const { showContextMenu, hideContextMenu } = useContextMenu();
  const [page, setPage] = useState(1);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<Employee>>({
    columnAccessor: "name",
    direction: "asc",
  });

  const initialData = async () => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLE.contacts)
      .select("*");
    console.log({ data, error });
  };

  useEffect(() => {
    initialData();
  }, []);

  const contacts = useGetContacts();
  const tableData = contacts.data?.pages.map((singlePage) => singlePage).flat();
  console.log({ data: contacts.data });

  const [selectedRecords, setSelectedRecords] = useState<Employee[]>([]);

  const handleSortStatusChange = (status: DataTableSortStatus<Employee>) => {
    setPage(1);
    setSortStatus(status);
  };

  const editRecord = useCallback(({ firstName, lastName }: Employee) => {
    console.log({
      withBorder: true,
      title: "Editing record",
      message: `In a real application we could show a popup to edit ${firstName} ${lastName}, but this is just a demo, so we're not going to do that`,
    });
  }, []);

  const deleteRecord = useCallback(({ firstName, lastName }: Employee) => {
    console.log({
      withBorder: true,
      color: "red",
      title: "Deleting record",
      message: `Should delete ${firstName} ${lastName}, but we're not going to, because this is just a demo`,
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

  const sendMessage = useCallback(({ firstName, lastName }: Employee) => {
    console.log({
      withBorder: true,
      title: "Sending message",
      message: `A real application could send a message to ${firstName} ${lastName}, but this is just a demo and we're not going to do that because we don't have a backend`,
      color: "green",
    });
  }, []);

  const renderActions: DataTableColumn<Employee>["render"] = (record) => (
    <Group gap={4} justify="right" wrap="nowrap">
      <ActionIcon
        size="sm"
        variant="transparent"
        color="green"
        onClick={(e) => {
          e.stopPropagation(); // 👈 prevent triggering the row click function
          openModal({
            title: `Send message to ${record.firstName} ${record.lastName}`,
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

  const rowExpansion: DataTableProps<Employee>["rowExpansion"] = {
    allowMultiple: true,
    content: ({
      record: { id, sex, firstName, lastName, birthDate, department },
    }) => (
      <Flex p="xs" pl={rem(50)} gap="md" align="center">
        <Image
          radius="sm"
          w={50}
          h={50}
          alt={`${firstName} ${lastName}`}
          src={`https://xsgames.co/randomusers/avatar.php?g=${sex}&q=${id}`}
        />
        <Text size="sm" fs="italic">
          {firstName} {lastName}, born on{" "}
          {dayjs(birthDate).format("MMM D YYYY")}, works in {department.name}{" "}
          department at {department.company.name}.
          <br />
          His office address is {department.company.streetAddress},{" "}
          {department.company.city}, {department.company.state}.
        </Text>
      </Flex>
    ),
  };

  const handleContextMenu: DataTableProps<Employee>["onRowContextMenu"] = ({
    record,
    event,
  }) =>
    showContextMenu([
      {
        key: "edit",
        icon: <IconEdit size={14} />,
        title: `Edit ${record.firstName} ${record.lastName}`,
        onClick: () => editRecord(record),
      },
      {
        key: "delete",
        title: `Delete ${record.firstName} ${record.lastName}`,
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

  const now = dayjs();
  const aboveXs = (theme: MantineTheme) =>
    `(min-width: ${theme.breakpoints.xs})`;

  const columns: DataTableProps<Employee>["columns"] = [
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
