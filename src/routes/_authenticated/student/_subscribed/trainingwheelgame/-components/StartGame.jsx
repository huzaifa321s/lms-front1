import LevelCard from './LevelCard'


const levels = [
  {
    title: 'beginner',
    features: [
      "Questions will be simple",
      "1min will be provided to answer a question",
      "There will consist of mixed category e.g. GK, Science etc."
    ]
  },
  {
    title: 'intermediate',
    features: [
      "Questions will be medium level",
      "45s will be provided to answer a question",
      "There will consist of mixed category e.g. GK, Science etc."
    ]
  },
  {
    title: 'expert',
    features: [
      "Questions will be expert level",
      "30s will be provided to answer a question",
      "There will consist of mixed category e.g. GK, Science etc."
    ]
  }
]


const StartGame = ({ setStep, selectedLevel, setSelectedLevel }) => {

  return (
    <div className='min-h-[70vh] w-full flex justify-center items-center'>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {levels.map((level) => {
          return (
            <LevelCard
              key={level.title}
              level={level}
              setStep={setStep}
              selectedLevel={selectedLevel}
              setSelectedLevel={setSelectedLevel}
            />
          )
        })}
      </div>
    </div>
  )
}

export default StartGame