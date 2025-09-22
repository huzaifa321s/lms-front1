import { useParams, createLazyFileRoute } from '@tanstack/react-router';
import { useCallback, useState } from 'react';
import axios from 'axios';
import { Editor } from '@tinymce/tinymce-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectGroup,
} from '@/components/ui/select';
import { Header } from '@/components/layout/header';
import { queryOptions, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useAppUtils } from '../../../../../hooks/useAppUtils';
import { queryClient } from '../../../../../utils/globalVars';
import { ChevronLeft, Save, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming this utility exists

const blogQueryOptions = (blogID) =>
  queryOptions({
    queryKey: ['getAll', blogID],
    queryFn: async () => {
      try {
        const [blogCategoriesResponse, blogDetailsResponse] = await Promise.all([
          axios.get('/admin/blog-category/getAll'),
          axios.get(`/admin/blog/getBlog/${blogID}`, {}),
        ]);

        const blogCategories = blogCategoriesResponse.data.success ? blogCategoriesResponse.data.data : [];
        const blogDetails = blogDetailsResponse.data.success ? blogDetailsResponse.data.data : null;

        return { blogCategories, blogDetails };
      } catch (error) {
        console.error('Error fetching blog data:', error);
        toast.error('Internal server error');
        return { blogCategories: [], blogDetails: null };
      }
    },
  });

export const Route = createLazyFileRoute('/_authenticated/admin/blogs/edit/$blogID')({
  loader: ({ params }) => queryClient.ensureQueryData(blogQueryOptions(params.blogID)),
  component: BlogEditPage,
});

const defaultCover = `${import.meta.env.VITE_REACT_APP_STORAGE_BASE_URL}/defaults/blog-image.png`;

function BlogEditPage() {
  const { blogID } = useParams({ from: '/_authenticated/admin/blogs/edit/$blogID' });
  const { data } = useSuspenseQuery(blogQueryOptions(blogID));
  const { router } = useAppUtils();
  const { blogCategories, blogDetails } = data;
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [blogObj, setBlogObj] = useState(blogDetails);
  const [cover, setCover] = useState(
    blogDetails?.image
      ? `${import.meta.env.VITE_REACT_APP_STORAGE_BASE_URL}/courses/cover-images/${blogDetails.image}`
      : defaultCover
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogObj((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setCover(e.target.result);
      reader.readAsDataURL(file);
      setBlogObj((prev) => ({ ...prev, image: file }));
    }
  };

  const handleEditorChange = (content) => {
    setBlogObj((prev) => ({ ...prev, content: content }));
  };

  const update = useCallback(async () => {
    setIsLoading(true);
    const blogForm = new FormData();
    for (const key in blogObj) {
      blogForm.append(key, blogObj[key]);
    }

    try {
      const response = await axios.put(`/admin/blog/edit/${blogID}`, blogForm);
      if (response.data.success) {
        toast.success('Blog updated successfully');
        router.invalidate();
        await queryClient.invalidateQueries(blogQueryOptions(blogID));
      }
    } catch (error) {
      console.error('Update Error -> ', error);
      toast.error('Internal server error');
    } finally {
      setIsLoading(false);
    }
  }, [blogObj, blogID, router, queryClient]);

  return (
      <div className="relative min-h-screen bg-[#f8fafc]">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2563eb]/10 via-transparent to-transparent"></div>
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#10b981]/10 via-transparent to-transparent"></div>

      <Header className="relative z-10 mb-8 md:mb-12 bg-white border-b border-[#e2e8f0] shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
        <div className="my-2 flex w-full items-center justify-between">
          <div className="text-2xl font-bold text-[#1e293b] bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent">
            Edit Blog
          </div>
          <div className="flex gap-4 items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.history.back()}
              className="rounded-[8px] border-[#e2e8f0] bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] hover:border-[#cbd5e1] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <ChevronLeft className="h-5 w-5 mr-2 text-[#2563eb]" />
              Back
            </Button>
          </div>
        </div>
      </Header>

      <main className="relative z-10 max-w-7xl mx-auto p-6 md:p-10 rounded-[12px] bg-white border border-[#e2e8f0] shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-lg hover:shadow-[#cbd5e1]/20 transition-all duration-300">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content area */}
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold text-[#1e293b]">Blog Title</Label>
              <Input
                id="title"
                type="text"
                name="title"
                value={blogObj?.title || ''}
                onChange={handleChange}
                className="w-full rounded-[8px] border-[#e2e8f0] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-semibold text-[#1e293b]">Category</Label>
              <Select
                value={blogObj?.category || ''}
                onValueChange={(value) => setBlogObj((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="w-full md:w-[250px] rounded-[8px] border-[#e2e8f0] bg-white text-[#1e293b] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 transition-all duration-300">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#e2e8f0] shadow-sm">
                  <SelectGroup>
                    {blogCategories.length > 0 ? (
                      blogCategories.map((category) => (
                        <SelectItem
                          value={category._id}
                          key={category._id}
                          className="text-[#1e293b] hover:bg-[#f8fafc] focus:bg-[#f8fafc]"
                        >
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-categories" disabled className="text-[#94a3b8]">
                        No categories available
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-[#1e293b]">Content</Label>
              <Editor
                apiKey="93ruijg05gmbhogd98n12gie0bj6jkfkx3v5mcyw50kfpoob"
                value={blogObj?.content || ''}
                init={{
                  height: 500,
                  menubar: false,
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
                  ],
                  toolbar:
                    'undo redo | formatselect | bold italic backcolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist | outdent indent | ' +
                    'removeformat | help',
                  content_style:
                    'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; color: #1e293b; }',
                }}
                onEditorChange={handleEditorChange}
                className="border-[#e2e8f0] rounded-[8px] focus-within:ring-2 focus-within:ring-[#2563eb] transition-all duration-300"
              />
            </div>
          </div>

          {/* Sidebar for image upload */}
          <div className="w-full lg:w-96 flex-shrink-0 space-y-6">
            <div className="relative p-6 rounded-[12px] bg-white border border-dashed border-[#e2e8f0] shadow-inner">
              <div className="absolute inset-0 bg-[#2563eb]/5 rounded-[12px]"></div>
              <div className="relative z-10 space-y-4 text-center">
                <div className="flex justify-center items-center">
                  <div className="w-full h-48 overflow-hidden rounded-[8px] border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all duration-300">
                    <img
                      src={cover || defaultCover}
                      alt="Blog Cover"
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>
                <Label
                  htmlFor="imageInput"
                  className="inline-flex items-center gap-2 cursor-pointer text-sm font-medium text-[#2563eb] hover:text-[#1d4ed8] transition-colors duration-200"
                >
                  <Plus className="h-4 w-4" />
                  {cover && cover !== defaultCover ? 'Change Image' : 'Upload Image'}
                </Label>
                <Input
                  id="imageInput"
                  type="file"
                  className="sr-only"
                  onChange={handleImageUpload}
                  accept="image/*"
                />
                {cover && cover !== defaultCover && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCover(defaultCover);
                      setBlogObj((prev) => ({ ...prev, image: null }));
                    }}
                    className="mt-2 text-[#ef4444] hover:bg-[#fef2f2] hover:text-[#dc2626] transition-all duration-200"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove Image
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            onClick={update}
            disabled={isLoading}
            loading={isLoading}
            className="w-full md:w-auto rounded-[8px] bg-[#2563eb] text-white font-semibold py-3 px-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:bg-[#1d4ed8] hover:shadow-lg focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 transition-all duration-300 transform hover:scale-105"
          >
            
              <Save className="h-5 w-5 mr-2" />
            
            Save Changes
          </Button>
        </div>
      </main>
    </div>
  );
}

export default BlogEditPage;