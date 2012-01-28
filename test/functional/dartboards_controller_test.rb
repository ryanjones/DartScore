require 'test_helper'

class DartboardsControllerTest < ActionController::TestCase
  setup do
    @dartboard = dartboards(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:dartboards)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create dartboard" do
    assert_difference('Dartboard.count') do
      post :create, dartboard: @dartboard.attributes
    end

    assert_redirected_to dartboard_path(assigns(:dartboard))
  end

  test "should show dartboard" do
    get :show, id: @dartboard
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @dartboard
    assert_response :success
  end

  test "should update dartboard" do
    put :update, id: @dartboard, dartboard: @dartboard.attributes
    assert_redirected_to dartboard_path(assigns(:dartboard))
  end

  test "should destroy dartboard" do
    assert_difference('Dartboard.count', -1) do
      delete :destroy, id: @dartboard
    end

    assert_redirected_to dartboards_path
  end
end
