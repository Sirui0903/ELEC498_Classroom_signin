import BaseLayout from '../../layout/baseLayout';
import { Attendance } from '../../components/attendance';
import { ClassBase } from '../../components/class';
import { getAllUser } from '../../api/user';
import { getAllClass } from '../../api/class';

export default function Class(props: any) {
  const { userData, classData } = props;
  return (
    <BaseLayout>
      <ClassBase userData={userData} classData={classData} />
    </BaseLayout>
  );
}

export async function getStaticProps() {
  const userData = await getAllUser({});
  const classData = await getAllClass();
  return {
    props: {
      userData: userData.data,
      classData: classData.data,
    },
  };
}
