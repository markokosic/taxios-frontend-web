import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CopyButton,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
} from '@mantine/core';
import { Check, Copy, KeyRound, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import {
  getGetAllDriversQueryKey,
  getGetDriverQueryKey,
  useCreateDriverUser,
} from '@/api/generated/endpoints/drivers/drivers';
import { getGetAllUsersQueryKey } from '@/api/generated/endpoints/users/users';
import { CreateUserResponse, DriverResponse } from '@/api/generated/model';

interface CreateDriverUserModalProps {
  driver: DriverResponse;
  opened: boolean;
  onClose: () => void;
}

export const CreateDriverUserModal = ({
  driver,
  opened,
  onClose,
}: CreateDriverUserModalProps) => {
  const { t } = useTranslation(['app', 'common']);
  const queryClient = useQueryClient();
  const [email, setEmail] = useState(driver.email || '');
  const [createdUser, setCreatedUser] = useState<CreateUserResponse | null>(null);

  const { mutate: createUser, isPending } = useCreateDriverUser({
    mutation: {
      onSuccess: (response) => {
        if (response.data) {
          setCreatedUser(response.data);
          toast.success(t('app:drivers.user_access_modal.success_title'));
          queryClient.invalidateQueries({ queryKey: getGetDriverQueryKey(driver.id) });
          queryClient.invalidateQueries({ queryKey: getGetAllDriversQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetAllUsersQueryKey() });
        }
      },
      onError: (error: unknown) => {
        const errorMsg = error instanceof Error ? error.message : t('common:error');
        toast.error(errorMsg);
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser({
      id: driver.id,
      data: email ? { email } : undefined,
    });
  };

  const handleClose = () => {
    setCreatedUser(null);
    setEmail(driver.email || '');
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Group gap="xs">
          <ThemeIcon
            color="blue"
            variant="light"
            radius="md"
            size="md"
          >
            <KeyRound size={18} />
          </ThemeIcon>
          <Text fw={600}>
            {t('app:drivers.user_access_modal.title')}
          </Text>
        </Group>
      }
      size="md"
      radius="md"
    >
      {createdUser ? (
        <Stack gap="md" pt="xs">
          <Alert
            color="green"
            title={t('app:drivers.user_access_modal.success_title')}
            icon={<ShieldCheck size={20} />}
            radius="md"
          >
            {t('app:drivers.user_access_modal.success_hint')}
          </Alert>

          {createdUser.temporaryPassword && (
            <Box
              p="md"
              style={{
                backgroundColor: 'var(--mantine-color-gray-0)',
                border: '1px dashed var(--mantine-color-gray-4)',
                borderRadius: 'var(--mantine-radius-md)',
              }}
            >
              <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="xs">
                {t('app:drivers.user_access_modal.temporary_password_label')}
              </Text>
              <Group justify="space-between" align="center">
                <Text
                  fw={700}
                  size="lg"
                  style={{
                    fontFamily: 'monospace',
                    letterSpacing: '0.05em',
                    color: 'var(--mantine-color-blue-9)',
                  }}
                >
                  {createdUser.temporaryPassword}
                </Text>
                <CopyButton value={createdUser.temporaryPassword} timeout={2500}>
                  {({ copied, copy }) => (
                    <Button
                      color={copied ? 'teal' : 'blue'}
                      variant="light"
                      size="xs"
                      onClick={copy}
                      leftSection={copied ? <Check size={14} /> : <Copy size={14} />}
                    >
                      {copied
                        ? t('app:drivers.user_access_modal.copied')
                        : t('app:drivers.user_access_modal.copy_button')}
                    </Button>
                  )}
                </CopyButton>
              </Group>
            </Box>
          )}

          <Text size="xs" c="dimmed">
            {t('app:drivers.user_access_modal.must_change_hint')}
          </Text>

          <Group justify="flex-end" mt="md">
            <Button onClick={handleClose}>
              {t('app:drivers.user_access_modal.close')}
            </Button>
          </Group>
        </Stack>
      ) : (
        <form onSubmit={handleSubmit}>
          <Stack gap="md" pt="xs">
            <Text size="sm" c="dimmed">
              {t('app:drivers.user_access_modal.description')}
            </Text>

            <TextInput
              label={t('app:drivers.user_access_modal.email_label')}
              description={t('app:drivers.user_access_modal.email_description')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              placeholder="fahrer@example.com"
              required
            />

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={handleClose}>
                {t('common:actions.cancel')}
              </Button>
              <Button
                type="submit"
                loading={isPending}
                leftSection={<KeyRound size={16} />}
              >
                {t('app:drivers.user_access_modal.submit_button')}
              </Button>
            </Group>
          </Stack>
        </form>
      )}
    </Modal>
  );
};
