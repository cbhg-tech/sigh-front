import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../app/FirebaseConfig';
import { useGlobal } from '../../contexts/global.context';
import { IAthlete } from '../../types/Athlete';
import { UploadFile } from '../../utils/uploadFile';
import { IAthletesDocuments } from './Register/register.context';

export interface BasicData extends Omit<IAthlete, 'registerNumber'> {
  name?: string;
}

interface EditDocuments {
  documents: {
    rgNumber?: string;
    rgEmissionDate?: string;
    rgEmissionOrg?: string;
  };
  documentFiles?: IAthletesDocuments;
}

type EditHospitalData = Pick<IAthlete, 'hospitalData' | 'emergencyContact'>;

type EditLGPD = {
  termsAccepted?: boolean;
  imageUseAccepted?: boolean;
  dataUseAccepted?: boolean;
};

export const useAthlete = () => {
  const queryClient = useQueryClient();
  const { user } = useGlobal();

  const { mutateAsync: editBasicData, status: editBasicDataStatus } =
    useMutation(async (data: BasicData) => {
      if (!user?.id) return;

      if (data.address) {
        // eslint-disable-next-line no-param-reassign
        data.address.country = 'BR';
      }

      await updateDoc(doc(db, 'users', user.id), {
        ...user,
        name: data.name,
        athleteProfile: {
          ...user.athleteProfile,
          ...data,
        },
        updatedAt: new Date(),
      });

      if (data.gender) {
        await updateDoc(doc(db, 'userApproval', user.id), {
          gender: data.gender,
          updatedAt: new Date(),
        });
      }

      await queryClient.invalidateQueries(['getCurrentUser']);
    });

  const { mutateAsync: editDocuments, status: editDocumentsStatus } =
    useMutation(async (data: EditDocuments) => {
      if (!user?.id) return;

      let commitmentTerm = user.athleteProfile?.documents?.commitmentTerm || '';
      let medicalCertificate =
        user.athleteProfile?.documents?.medicalCertificate || '';
      let noc = user.athleteProfile?.documents?.noc || '';
      let personalDocument =
        user.athleteProfile?.documents?.personalDocument || '';

      if (data.documentFiles) {
        const {
          commitmentTerm: ctFIle,
          medicalCertificate: mcFile,
          noc: nocFile,
          personalDocument: pdFile,
        } = data.documentFiles;

        if (ctFIle) {
          commitmentTerm = await UploadFile(
            `athletes/${user.id}/documents/commitmentTerm`,
            ctFIle,
          );
        }

        if (mcFile) {
          medicalCertificate = await UploadFile(
            `athletes/${user.id}/documents/medicalCertificate`,
            mcFile,
          );
        }

        if (nocFile) {
          noc = await UploadFile(`athletes/${user.id}/documents/noc`, nocFile);
        }

        if (pdFile) {
          personalDocument = await UploadFile(
            `athletes/${user.id}/documents/personalDocument`,
            pdFile,
          );
        }
      }

      await updateDoc(doc(db, 'users', user.id), {
        ...user,
        athleteProfile: {
          ...user.athleteProfile,
          documents: {
            rgNumber:
              data.documents.rgNumber ||
              user.athleteProfile?.documents.rgNumber,
            rgEmissionDate:
              data.documents.rgEmissionDate ||
              user.athleteProfile?.documents.rgEmissionDate,
            rgEmissionOrg:
              data.documents.rgEmissionOrg ||
              user.athleteProfile?.documents.rgEmissionOrg,
            commitmentTerm,
            medicalCertificate,
            noc,
            personalDocument,
          },
        },
        updatedAt: new Date(),
      });

      await queryClient.invalidateQueries(['getCurrentUser']);
    });

  const { mutateAsync: editHospitalData, status: editHospitalDataStatus } =
    useMutation(async (data: EditHospitalData) => {
      if (!user?.id) return;

      await updateDoc(doc(db, 'users', user.id), {
        ...user,
        athleteProfile: {
          ...user.athleteProfile,
          hospitalData: {
            ...data.hospitalData,
          },
          emergencyContact: {
            ...data.emergencyContact,
          },
        },
        updatedAt: new Date(),
      });

      await queryClient.invalidateQueries(['getCurrentUser']);
    });

  const { mutateAsync: editLGPD, status: editLGPDStatus } = useMutation(
    async (data: EditLGPD) => {
      if (!user?.id) return;

      await updateDoc(doc(db, 'users', user.id), {
        ...user,
        athleteProfile: {
          ...user.athleteProfile,
          ...data,
        },
        updatedAt: new Date(),
      });

      await queryClient.invalidateQueries(['getCurrentUser']);
    },
  );

  return {
    editBasicData,
    editBasicDataStatus,
    editDocuments,
    editDocumentsStatus,
    editHospitalData,
    editHospitalDataStatus,
    editLGPD,
    editLGPDStatus,
  };
};
