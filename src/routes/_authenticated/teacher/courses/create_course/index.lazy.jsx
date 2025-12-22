import { useCallback, useState } from 'react';
import axios from 'axios';
import { useRouter, createLazyFileRoute } from '@tanstack/react-router';
import { useNavigate } from '@tanstack/react-router';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { QueryClient, queryOptions, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useAppUtils } from '@/hooks/useAppUtils';
import { objectToFormData } from '@/shared/utils/helperFunction';
import { getTeacherCreds } from '../../-utils/helperFunctions';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button'
import { ArrowLeft, Book, BookOpen, Delete, Image, NotebookText, Plus, PlusCircleIcon } from 'lucide-react';
import { getFileUrl } from '@/utils/globalFunctions';

const queryClient = new QueryClient();

const categoryQueryOptions = () =>
  queryOptions({
    queryKey: ['courseCategory'],
    queryFn: async () => {
      try {
        let response = await axios.get('/teacher/course-category/getAll');
        response = response.data;
        const creds = await getTeacherCreds()
        console.log('creds t', creds)
        if (response.success) {
          return { courseCategories: response.data, credentials: creds };
        }
      } catch (error) {
        console.log('error', error);
        return { courseCategories: [], credentiasl: null };
      }
    },
    retry: 1,
    refetchOnWindowsFocus: false
  });

export const Route = createLazyFileRoute('/_authenticated/teacher/courses/create_course/')({
  loader: () => queryClient.ensureQueryData(categoryQueryOptions()),
  component: RouteComponent,
});

const defaultCover = getFileUrl('course-cover.png', 'defaults');

function RouteComponent() {
  const navigate = useNavigate();
  const { router } = useAppUtils();
  const { data, credentials } = useSuspenseQuery(categoryQueryOptions());

  const [cover, setCover] = useState(null);
  const { courseCategories } = data;
  const queryClient = useQueryClient();
  const TEMPLATE_UPDATE_OBJ = {
    coverImage: null,
    name: '',
    description: '',
    category: '',
    instructor: credentials?._id,
    material: [{ title: '', description: '', media: '' }],
  };

  const [courseObj, setCourseObj] = useState(TEMPLATE_UPDATE_OBJ);
  const [numberOfMaterials, setNumberOfMaterials] = useState(1);

  // Handle Changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setCourseObj((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setCover(e.target.result);
      reader.readAsDataURL(file);
      setCourseObj((prev) => ({ ...prev, coverImage: file }));
    }
  }, []);

  // Materials
  const addMaterial = useCallback(() => {
    const newMaterials = Array.from({ length: numberOfMaterials }, () => ({
      title: '',
      description: '',
      media: '',
    }));
    setCourseObj((prev) => ({
      ...prev,
      material: [...prev.material, ...newMaterials],
    }));
  }, [numberOfMaterials]);

  const removeMaterial = useCallback(
    (i) => {
      const updatedMaterials = [...courseObj.material];
      updatedMaterials.splice(i, 1);
      setCourseObj((prev) => ({ ...prev, material: updatedMaterials }));
    },
    [courseObj.material]
  );

  const handleMaterialChange = useCallback(
    (i, e) => {
      const { name, value } = e.target;
      const updatedMaterials = [...courseObj.material];
      updatedMaterials[i][name] = value;
      setCourseObj((prev) => ({ ...prev, material: updatedMaterials }));
    },
    [courseObj.material]
  );

  const handleMaterialFileUpload = useCallback(
    (i, e) => {
      const file = e.target.files[0];
      const updatedMaterials = [...courseObj.material];
      updatedMaterials[i].media = file;
      setCourseObj((prev) => ({ ...prev, material: updatedMaterials }));
    },
    [courseObj.material]
  );

  const isCreateButtonDisabled = useCallback(() => {
    if (courseObj.name.trim() === '' || courseObj.description.trim() === '') {
      return true;
    }
    if (courseObj.material.length === 0) {
      return true;
    }
    return courseObj.material.some(
      (m) => m.title.trim() === '' || m.description.trim() === '' || !m.media
    );
  }, [courseObj]);

  // API Methods
  const postData = useCallback(
    async (formData) => {
      try {
        let response = await axios.post('/teacher/course/create', formData);
        response = response.data;
        if (response.success) {
          toast.success(response.message);
          await queryClient.invalidateQueries(categoryQueryOptions());
          router.invalidate();
          navigate({ to: '/teacher/courses' });
        }
      } catch (error) {
        const errorResponse = error.response.data;
        toast.error(errorResponse.message);
      }
    },
    [navigate, router, queryClient]
  );

  const create = useCallback(() => {
    courseObj['material_length'] = courseObj.material.length;
    const formdata = objectToFormData(courseObj);
    postData(formdata);
  }, [courseObj, postData]);

  return (
    <>

      <Header >
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold  bg-clip-text ">
              Create Course
            </div>
            <div className="hidden sm:block w-px h-8 bg-gradient-to-b from-[#e2e8f0] to-[#cbd5e1]"></div>
            <div className="hidden sm:flex items-center gap-2 ">
              <Plus />

              <span className="text-sm font-medium">Add New Course</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size='sm'
              className="text-black"
              variant='outline'
              onClick={() => window.history.back()}
            >
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back
            </Button>
          </div>
        </div>
      </Header>
      <div className="min-h-screen font-sans bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#f1f5f9]">



        {/* Main Content */}
        <div className="relative z-10  px-4 py-8 space-y-8">
          {/* Course Details Card */}
          <div className="relative overflow-hidden rounded-[12px] border border-[#e2e8f0] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb]/5 to-[#1d4ed8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent">
                <Book />
                Course Details
              </h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Cover Image */}
                  <div className="space-y-2">
                    <label htmlFor="coverImage" className="text-[#64748b] block">
                      Course Cover Image
                    </label>
                    <div className="relative aspect-video overflow-hidden rounded-[12px] border border-dashed border-[#e2e8f0] group/image flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-[#cbd5e1]">
                      <img
                        src={cover || defaultCover}
                        alt="Course Cover"
                        className="object-cover w-full h-full"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
                        <Image />
                      </div>
                      <input
                        id="coverImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                    <p className="text-xs text-[#94a3b8]">
                      Upload a high-quality image. JPG, PNG, or GIF.
                    </p>
                  </div>

                  {/* Name, Description, Category */}
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="text-[#64748b] block">
                        Course Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        value={courseObj.name}
                        onChange={handleChange}
                        placeholder="e.g., Advanced React Patterns"
                        className="flex h-10 w-full rounded-[8px] border border-[#e2e8f0] bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#94a3b8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="description" className="text-[#64748b] block">
                        Course Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={courseObj.description}
                        onChange={handleChange}
                        placeholder="e.g., Master modern React development with..."
                        className="flex min-h-[80px] w-full rounded-[8px] border border-[#e2e8f0] bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-[#94a3b8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1 min-h-[120px]"
                      />
                    </div>
                    <div>
                      <label htmlFor="category" className="text-[#64748b] block">
                        Category
                      </label>
                      <div className="relative">
                        <select
                          name="category"
                          value={courseObj.category}
                          onChange={(e) =>
                            setCourseObj((prev) => ({
                              ...prev,
                              category: e.target.value,
                            }))
                          }
                          className="w-full flex h-10 items-center justify-between rounded-[8px] border border-[#e2e8f0] bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                        >
                          <option value="">Select a category</option>
                          {courseCategories?.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Materials Card */}
          <div className="relative overflow-hidden rounded-[12px] border border-[#e2e8f0] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#f59e0b]/5 to-[#d97706]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3 bg-gradient-to-r from-[#f59e0b] to-[#d97706] bg-clip-text text-transparent">
                  <NotebookText />
                  Course Materials ({courseObj.material.length})
                </h2>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={numberOfMaterials}
                    onChange={(e) =>
                      setNumberOfMaterials(Math.max(1, parseInt(e.target.value, 10)))
                    }
                    className="flex h-10 w-20 rounded-[8px] border border-[#e2e8f0] bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-[#94a3b8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Button
                    onClick={addMaterial}
                  >
                    <PlusCircleIcon />
                    Add
                  </Button>
                </div>
              </div>
              <div className="space-y-6">
                {courseObj.material.length === 0 && (
                  <div className="text-center py-8 text-[#64748b]">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 text-[#94a3b8]" />
                    <p>No materials added yet. Click "Add Material" to get started.</p>
                  </div>
                )}
                {courseObj.material.map((material, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] p-6 rounded-[12px] border border-[#e2e8f0] shadow-sm relative group"
                  >
                    {courseObj.material.length !== 1 && (
                      <Button
                        variant="destructive"
                        onClick={() => removeMaterial(index)}
                      >
                        <Delete />
                      </Button>
                    )}
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor={`material-title-${index}`}
                          className="text-[#64748b] block"
                        >
                          Material Title
                        </label>
                        <input
                          id={`material-title-${index}`}
                          name="title"
                          value={material.title}
                          onChange={(e) => handleMaterialChange(index, e)}
                          placeholder="e.g., Intro to Hooks"
                          className="flex h-10 w-full rounded-[8px] border border-[#e2e8f0] bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#94a3b8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`material-description-${index}`}
                          className="text-[#64748b] block"
                        >
                          Description
                        </label>
                        <textarea
                          id={`material-description-${index}`}
                          name="description"
                          value={material.description}
                          onChange={(e) => handleMaterialChange(index, e)}
                          placeholder="A brief description of the material..."
                          className="flex min-h-[80px] w-full rounded-[8px] border border-[#e2e8f0] bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-[#94a3b8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`material-media-${index}`}
                          className="text-[#64748b] block"
                        >
                          File Upload
                        </label>
                        <div className="mt-1 flex items-center space-x-2">
                          <div className="relative">
                            <label
                              htmlFor={`material-media-${index}`}
                              className="inline-flex items-center justify-center whitespace-nowrap rounded-[8px] text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-[#e2e8f0] bg-[#f1f5f9] hover:bg-[#e2e8f0] hover:text-[#475569] h-9 px-3 py-2 cursor-pointer"
                            >
                              {material.media ? 'Selected' : 'Upload File'}
                            </label>
                            <input
                              id={`material-media-${index}`}
                              name="media"
                              type="file"
                              onChange={(e) => handleMaterialFileUpload(index, e)}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                          </div>
                          {material.media && (
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2 border-[#e2e8f0] text-[#2563eb]">
                              {typeof material.media === 'string'
                                ? material.media.split('-')[1] || material.media.split('/').pop()
                                : material.media.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-[8px] text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3 py-2 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white shadow-lg"
                  onClick={create}
                  disabled={isCreateButtonDisabled()}
                >
                  <Plus />
                  Create Course
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}