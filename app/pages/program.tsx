import { promises as fs } from 'fs';
import Link from 'next/link';
import path from 'path';
import Header from '@/components/Header';

const Index = (props) => {
  return (
    <main>
      <div className='page-title flex justify-between p-6 font-bold text-4xl text-white text-center'>
        <h1>Bundle</h1>
        <Header />
      </div>
      <div className='content-page'>
        {props.workouts.map((workout, i) => (
          <Link href={`./program/${workout.folder}`} key={i}>
            <h3>{workout.title}</h3>
          </Link>
        ))}
      </div>
    </main>
  )
}
 
export async function getStaticProps() {
  const folder = path.join(process.cwd(), './content/program');
  const filenames = await fs.readdir(folder);

  return {
    props: {
      workouts: filenames.map((filename) => {
          const capitalisedFirstLetter = filename.charAt(0).toUpperCase() + filename.slice(1);
          if(filename.includes('.md')) {
            return {
              title: capitalisedFirstLetter.replace('.md', ''),
              folder: filename
            }
          };
          return {
            title:capitalisedFirstLetter.substring(0, 4) + " " + capitalisedFirstLetter.substring(4),
            folder: filename
          }
      })
    }
  }
}

export default Index;