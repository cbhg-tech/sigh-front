import { useMutation, useQuery } from '@tanstack/react-query';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { db } from '../../app/FirebaseConfig';
import { Roles } from '../../enums/Roles';
import { useHasPermission } from '../../hooks/useHasPermission';
import { ITechnicalOfficer } from '../../types/TechnicalOfficer';
import { handleFormErrors } from '../../utils/handleFormErrors';
import { UploadFile } from '../../utils/uploadFile';
import { validateForm } from '../../utils/validateForm';

interface IProps {
  isDisplayMode?: boolean;
}

export interface IForm {
  name: string;
  email: string;
  phone: string;
  gender: string;
  birthDate: string;
  document?: File;
}

export const useCreateTechnicalOfficer = ({ isDisplayMode }: IProps) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isAdmin = useHasPermission([Roles.ADMIN]);

  const getById = async () => {
    if (!id) return null;

    const res = await getDoc(doc(db, 'technicalOfficers', id));

    return {
      id: res.id,
      ...res.data(),
    } as ITechnicalOfficer;
  };

  const handleSubmit = async (data: IForm) => {
    if (isDisplayMode) return;

    if (!isAdmin) return;

    const { document } = data;

    try {
      await validateForm(data, {
        name: Yup.string().required('Nome obrigatório'),
        phone: Yup.string().required('Celular obrigatório'),
        birthDate: Yup.date().required('Data de nascimento obrigatória'),
        gender: Yup.string().required('Gênero obrigatório'),
        email: Yup.string().required('Email obrigatório'),
        charge: Yup.string().required('Cargo obrigatório'),
        address: Yup.string().required('Endereço obrigatório'),
      });

      if (!id) {
        if (!document) {
          toast.error('É necessário enviar o documento de identificação');
          return;
        }

        const res = await addDoc(collection(db, 'technicalOfficers'), {
          ...data,
          relatedId: 'CBHG - Administração',
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const documentUrl = await UploadFile(
          `technicalOfficers/cbhg`,
          document,
        );

        await updateDoc(doc(db, 'technicalOfficers', res.id), {
          documentFile: documentUrl,
        });

        toast.success('Oficial técnico criado com sucesso');
      } else {
        const documentUrl =
          typeof document !== 'string'
            ? await UploadFile(`technicalOfficers/cbhg`, document!)
            : document;

        await updateDoc(doc(db, 'technicalOfficers', id!), {
          ...data,
          documentUrl,
          updatedAt: new Date(),
        });

        toast.success('Oficial técnico atualizado com sucesso');
      }

      navigate('/app/tecnico/listagem');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = handleFormErrors(err);

        throw errors;
      }

      toast.error('Ops! Não foi possivel salvar dados!');
    }
  };

  const {
    data,
    status: queryStatus,
    isLoading: queryLoading,
  } = useQuery(['getTechnicalOfficerById'], getById, {
    enabled: !!id,
  });
  const { mutateAsync, status: mutationStatus } = useMutation(handleSubmit);

  return {
    mutateAsync,
    data,
    queryStatus,
    mutationStatus,
    queryLoading,
  };
};
