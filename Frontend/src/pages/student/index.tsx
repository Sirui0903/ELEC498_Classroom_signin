import BaseLayout from '../../layout/baseLayout';
import { Student } from '../../components/student';
import { getAllUser } from '../../api/user';
import { getAllClass } from '../../api/class';
export default function StudentBase(props: { classData: any[] }) {
  return (
    <BaseLayout>
      <Student classData={props.classData} />
    </BaseLayout>
  );
}

export async function getStaticProps() {
  const classData = await getAllClass();
  return {
    props: {
      classData: classData.data,
    },
  };
}
