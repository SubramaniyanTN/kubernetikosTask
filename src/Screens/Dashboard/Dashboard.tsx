import {
  ActionIcon,
  Button,
  Center,
  Flex,
  Group,
  MantineTheme,
  Modal,
  Text,
  TextInput,
  rem,
} from "@mantine/core";
import { closeAllModals, openModal } from "@mantine/modals";
import {
  IconClick,
  IconEdit,
  IconTrashX,
  IconTrash,
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
import {
  useCreateContact,
  useDeleteContact,
  useGetContacts,
  useUpdateContact,
} from "../../Query/Contacts/contacts";
import { ContactsType } from "../../utils/SUPABASE_TABLE";
import { supabase, useDebounce } from "../../utils";
import { useDisclosure } from "@mantine/hooks";

let PAGE_SIZE = 10;

const Dashboard = () => {
  const [limit, setLimit] = useState(10);
  const deleteContact = useDeleteContact();
  const updateContact = useUpdateContact();
  const [opened, { open, close }] = useDisclosure(false);
  const [isEdit, setIsEdit] = useState(false);
  const [contactData, setContactData] = useState<ContactsType>({
    age: 0,
    city: "",
    company: "",
    department: "",
    description: "",
    email: "",
    name: "",
    state: "",
  });
  const onChange = <K extends keyof ContactsType>(
    key: K,
    value: ContactsType[K]
  ) => {
    setContactData((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };
  const debouncedOnChange = useDebounce({
    func: onChange,
  });
  const { showContextMenu, hideContextMenu } = useContextMenu();
  const [page, setPage] = useState(1);
  const [sortStatus, setSortStatus] = useState<
    DataTableSortStatus<ContactsType>
  >({
    columnAccessor: "name",
    direction: "asc",
  });

  const contacts = useGetContacts("", limit);
  const tableData = contacts.data?.pages.map((singlePage) => singlePage).flat();

  const [selectedRecords, setSelectedRecords] = useState<ContactsType[]>([]);

  const handleSortStatusChange = (
    status: DataTableSortStatus<ContactsType>
  ) => {
    setPage(1);
    setSortStatus(status);
  };
  const createContact = useCreateContact();
  useEffect(() => {
    if (!opened) {
      setContactData({
        age: 0,
        city: "",
        company: "",
        department: "",
        description: "",
        email: "",
        name: "",
        state: "",
      });
      if (isEdit) {
        setIsEdit(false);
      }
    }
  }, [opened]);

  const creatingData = async () => {
    const response = await supabase.auth.getUser();
    if (response.data) {
      createContact.mutate({
        url: `/contacts`,
        data: {
          ...contactData,
          created_by: response.data.user?.id,
        },
      });
    }
    close();
  };
  const updatingData = async () => {
    const response = await supabase.auth.getUser();
    if (response.data) {
      updateContact.mutate({
        url: `/contacts`,
        data: {
          age: contactData.age,
          city: contactData.city,
          company: contactData.company,
          department: contactData.department,
          description: contactData.description,
          email: contactData.email,
          name: contactData.name,
          state: contactData.state,
        },
        config: {
          params: {
            id: `eq.${contactData.id}`,
          },
        },
      });
    }
    close();
  };

  const editRecord = useCallback(
    ({
      name,
      age,
      city,
      company,
      department,
      description,
      email,
      state,
      id,
    }: ContactsType) => {
      setContactData({
        age,
        city,
        company,
        department,
        description,
        email,
        name,
        state,
        id,
      });
      setIsEdit(true);
      open();
    },
    []
  );

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

  const deleteRow = useCallback(async ({ name, id }: ContactsType) => {
    deleteContact.mutate({
      url: `/contacts`,
      data: {
        is_deleted: true,
      },
      config: {
        params: {
          id: `eq.${id}`,
        },
      },
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
            title: `Are you sure to delete the ${record.name}?`,
            classNames: {
              header: classes.modalHeader,
              title: classes.modalTitle,
            },
            children: (
              <>
                <Group mt="md" gap="sm" justify="flex-end">
                  <Button
                    variant="transparent"
                    c="dimmed"
                    onClick={() => closeAllModals()}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="red"
                    onClick={() => {
                      deleteRow(record);
                      closeAllModals();
                    }}
                  >
                    Delete
                  </Button>
                </Group>
              </>
            ),
          });
        }}
      >
        <IconTrash size={16} />
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
    <div className="w-full h-full p-4">
      <div className="w-full flex justify-end items-end my-2">
        <Button onClick={open}>Create Contact</Button>
      </div>
      <div className="overflow-auto h-[calc(100vh-100px)]">
        <DataTable
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
      <Modal
        opened={opened}
        onClose={close}
        title={isEdit ? "Edit Contact" : "Create Contact"}
      >
        <TextInput
          label="Enter name"
          placeholder="Name"
          defaultValue={contactData.name}
          onChange={(event) =>
            debouncedOnChange("name", event.currentTarget.value)
          }
        />
        <TextInput
          label="Enter Age"
          placeholder="Age"
          defaultValue={contactData.age}
          onChange={(event) =>
            debouncedOnChange("age", Number(event.currentTarget.value))
          }
          type="number"
        />
        <TextInput
          label="Enter City"
          placeholder="City"
          defaultValue={contactData.city}
          onChange={(event) =>
            debouncedOnChange("city", event.currentTarget.value)
          }
        />
        <TextInput
          label="Enter Company"
          placeholder="Company"
          defaultValue={contactData.company.toString()}
          onChange={(event) =>
            debouncedOnChange("company", event.currentTarget.value)
          }
        />
        <TextInput
          label="Enter Department"
          placeholder="Department"
          defaultValue={contactData.department}
          onChange={(event) =>
            debouncedOnChange("department", event.currentTarget.value)
          }
        />
        <TextInput
          label="Enter Description"
          placeholder="Description"
          defaultValue={contactData.description}
          onChange={(event) =>
            debouncedOnChange("description", event.currentTarget.value)
          }
        />
        <TextInput
          label="Enter Email"
          placeholder="Email"
          defaultValue={contactData.email}
          onChange={(event) =>
            debouncedOnChange("email", event.currentTarget.value)
          }
        />
        <TextInput
          label="Enter State"
          placeholder="State"
          defaultValue={contactData.state}
          onChange={(event) =>
            debouncedOnChange("state", event.currentTarget.value)
          }
        />
        <div className="my-3 flex flex-row justify-end">
          <Button
            variant="filled"
            onClick={isEdit ? updatingData : creatingData}
          >
            {isEdit ? "Update Contact" : "Create Contact"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
