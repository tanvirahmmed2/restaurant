'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { MdStar, MdDelete, MdRateReview } from 'react-icons/md'
import toast from 'react-hot-toast'

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchReviews = async () => {
    try {
      const res = await axios.get('/api/review', { withCredentials: true })
      setReviews(res.data.payload || [])
    } catch (error) {
      console.error("Failed to fetch reviews", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return

    try {
      const res = await axios.delete('/api/review', { 
        data: { id },
        withCredentials: true 
      })
      toast.success(res.data.message)
      setReviews(reviews.filter(r => r.id !== id))
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete review")
    }
  }

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <MdStar key={i} className={`text-xl ${i < rating ? 'text-amber-400' : 'text-gray-200'}`} />
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Customer Reviews</h1>
        <p className="text-gray-500 text-sm">Manage feedback and testimonials from your customers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between gap-6 group hover:shadow-md transition-shadow">
              
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900 line-clamp-1">{review.name}</h3>
                    <p className="text-xs text-gray-400 line-clamp-1">{review.email}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl relative">
                  <MdRateReview className="absolute top-2 right-2 text-gray-200 text-3xl opacity-50" />
                  <p className="text-gray-600 text-sm italic relative z-10">&quot;{review.comment}&quot;</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
                <button 
                  onClick={() => handleDelete(review.id)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  title="Delete Review"
                >
                  <MdDelete size={20} />
                </button>
              </div>

            </div>
          ))
        ) : (
          <div className="col-span-full p-12 text-center flex flex-col items-center gap-3 bg-white rounded-3xl border border-dashed border-gray-200">
            <MdRateReview size={48} className="text-gray-300" />
            <p className="text-gray-500 font-medium">No reviews received yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewsPage
