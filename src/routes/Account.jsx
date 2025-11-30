import {
  deleteUser,
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  sendEmailVerification,
  signOut,
  updateEmail,
  updatePassword,
} from 'firebase/auth';
import { getDatabase, ref, remove } from 'firebase/database';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useParams } from 'wouter';

import { AlertContext } from '../components/Alert';
import LanguageSelect from '../components/LanguageSelect';
import useLoading from '../hooks/use-loading';
import useUser from '../hooks/use-user';
import Heading from '../styled/Heading';
import Link, { LinkSet } from '../styled/Link';
import LoadingScreen from '../styled/LoadingScreen';
import { Paragraph } from '../styled/Paragraph';
import { fieldPresets, Form } from './Auth';

const auth = getAuth();
const db = getDatabase();

async function reauthenticate(password) {
  const credential = EmailAuthProvider.credential(
    auth.currentUser.email,
    password,
  );
  await reauthenticateWithCredential(auth.currentUser, credential);
}

function AccountAction({ action }) {
  const { t } = useTranslation();
  const [, setAlert] = useContext(AlertContext);
  const [, setIsLoading] = useLoading();

  const changeEmail = async ({ password, email }) => {
    try {
      setIsLoading(true);
      await reauthenticate(password);
      await updateEmail(auth.currentUser, email);
      setAlert(['info', 'email-updated', '/account']);
    } catch (error) {
      console.error(error);
      setAlert(['error', error.code]);
    } finally {
      setIsLoading(false);
    }
  };
  const changePassword = async ({ oldPassword, newPassword }) => {
    try {
      setIsLoading(true);
      await reauthenticate(oldPassword);
      await updatePassword(auth.currentUser, newPassword);
      setAlert(['info', 'password-updated', '/account']);
    } catch (error) {
      console.error(error);
      setAlert(['error', error.code]);
    } finally {
      setIsLoading(false);
    }
  };
  const deleteAccount = async ({ password }) => {
    try {
      setIsLoading(true);
      await reauthenticate(password);
      await remove(ref(db, `users/${auth.currentUser.uid}`));
      await deleteUser(auth.currentUser);
      setAlert(['info', 'account-deleted', '/']);
    } catch (error) {
      console.error(error);
      setAlert(['error', error.code]);
    } finally {
      setIsLoading(false);
    }
  };

  switch (action) {
    case 'change-email':
      return (
        <>
          <Heading>{t('accountActions.changeEmail.heading')}</Heading>
          <Form
            fields={[
              fieldPresets.password,
              {
                type: 'email',
                placeholder: 'newEmail',
                key: 'email',
              },
            ]}
            onSubmit={changeEmail}
          />
          <Link href="/account">{t('links.back')}</Link>
        </>
      );
    case 'change-password':
      return (
        <>
          <Heading>{t('accountActions.changePassword.heading')}</Heading>
          <Form
            fields={[
              {
                type: 'password',
                placeholder: 'oldPassword',
                key: 'oldPassword',
              },
              {
                type: 'password',
                placeholder: 'newPassword',
                key: 'newPassword',
              },
            ]}
            onSubmit={changePassword}
          />
          <Link href="/account">{t('links.back')}</Link>
        </>
      );
    case 'delete':
      return (
        <>
          <Heading>{t('accountActions.deleteAccount.heading')}</Heading>
          <Paragraph>{t('accountActions.deleteAccount.text')}</Paragraph>
          <Form fields={[fieldPresets.password]} onSubmit={deleteAccount} />

          <Link href="/account">{t('links.back')}</Link>
        </>
      );
    default:
      return <Redirect to="/account" />;
  }
}

function Account() {
  const { t } = useTranslation();
  const [alert, setAlert] = useContext(AlertContext);
  const [, setIsLoading] = useLoading();
  const { action } = useParams();
  const [user, userLoading] = useUser();

  if (userLoading) return <LoadingScreen />;

  if (action) {
    return <AccountAction action={action} />;
  }

  if (alert) return alert;

  const resendLink = async () => {
    setIsLoading(true);
    await sendEmailVerification(auth.currentUser);
    setAlert(['info', 'link-sent']);
    setIsLoading(false);
  };

  return (
    <>
      <Heading>{t('account.heading')}</Heading>
      <Paragraph>
        {t('account.email.label', { email: user.email })}{' '}
        {!user.emailVerified && t('account.email.notVerified')}
      </Paragraph>
      <LinkSet $direction="column">
        <li>
          <Link href="/">{t('links.home')}</Link>
        </li>
        {!user.emailVerified && (
          <li>
            <Link as="button" onClick={resendLink}>
              {t('account.links.resendEmail')}
            </Link>
          </li>
        )}
        <li>
          <Link as="button" onClick={() => signOut(auth)}>
            {t('account.links.signOut')}
          </Link>
        </li>
        <li>
          <Link href="/account/change-email">
            {t('account.links.changeEmail')}
          </Link>
        </li>
        <li>
          <Link href="/account/change-password">
            {t('account.links.changePassword')}
          </Link>
        </li>
        <li>
          <Link href="/account/delete">{t('account.links.deleteAccount')}</Link>
        </li>
      </LinkSet>
      <LanguageSelect />
    </>
  );
}

export default Account;
